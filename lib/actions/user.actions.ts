"use server";

import { connectToDb } from "../database";
import { validateAdmin, validatePageAndLimit } from "./validation.actions";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import { CreateUserParams, UpdateUserParams, GetAllUsersParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import {
  CustomApiError,
  UnauthorizedError,
  UnprocessableEntity,
  NotFoundError,
} from "../errors";
import User, { IUser } from "../database/models/user.model";
import Career from "../database/models/career.model";
import Quote from "../database/models/quote.model";
import Review from "../database/models/review.model";
import Comment from "../database/models/comment.model";

type GetALLResult = {
  success: boolean;
  data: IUser[] | [] | null;
  totalPages?: number;
  error: string | null;
};

type DefaultResult = {
  success: boolean;
  data: IUser | null;
  error: string | null;
};

type BlockResult = {
  success: boolean;
  data: null;
  error: string | null;
};

export const populateUser = (query: any) => {
  return query.populate({
    path: "reviews",
    model: Review,
    populate: [
      {
        path: "createdBy",
        model: "User",
        options: { sort: { createdAt: -1 } },
        select: "_id firstName lastName photo",
      },
      {
        path: "comments",
        model: "Comment",
        populate: {
          path: "createdBy",
          model: "User",
          select: "_id firstName lastName photo",
        },
      },
    ],
  });
};

export async function getAllUsers({
  fetch,
  limit = 10,
  page = 1,
}: GetAllUsersParams): Promise<GetALLResult> {
  try {
    validatePageAndLimit(page, limit);

    await connectToDb();

    const { user, isAdmin, error } = await validateAdmin();

    if (error || !isAdmin || !user || !user.role)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const { role } = user;

    let conditions = null;

    if (role === "Admin") conditions = { role: { $nin: ["Admin", "Manager"] } };
    else if (role === "Manager") conditions = { _id: { $ne: user._id } };

    if (!conditions)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    if (fetch?.firstName)
      conditions = {
        ...conditions,
        firstName: new RegExp(`^${fetch?.firstName}`, "i"),
      };
    else if (fetch?.email)
      conditions = {
        ...conditions,
        email: new RegExp(`^${fetch?.email}`, "i"),
      };
    else if (fetch?.day) {
      const day = new Date(fetch?.day);
      const startOfTheDay = startOfDay(day);
      const endOfTheDay = endOfDay(day);
      conditions = {
        ...conditions,
        createdAt: { $gte: startOfTheDay, $lt: endOfTheDay },
      };
    } else if (fetch?.month) {
      const month = fetch?.month.getMonth();
      const year = fetch?.month.getFullYear();
      const startDate = startOfMonth(new Date(year, month, 1));
      const endDate = endOfMonth(new Date(year, month, 1));
      conditions = {
        ...conditions,
        createdAt: { $gte: startDate, $lte: endDate },
      };
    }

    const usersQuery = User.find(conditions);

    const skipAmount = (Number(page) - 1) * limit;

    const users = await populateUser(
      usersQuery.sort({ role: 1, createdAt: -1 }).skip(skipAmount).limit(limit)
    );

    if (users.length === 0) return { success: true, data: [], error: null };

    const totalPages = Math.ceil(
      (await Career.countDocuments(conditions)) / limit
    );

    const data = JSON.parse(JSON.stringify(users));

    return { success: true, data, totalPages, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function createUser(
  user: CreateUserParams
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const isUserExists = await User.findOne({ email: user.email });

    if (isUserExists) return { success: false, data: null, error: null };

    const adminMails = ["deia.tech2021@gmail.com", "mohagtareg@gmail.com"];
    const role = adminMails.includes(user.email) ? "Admin" : "User";

    const newUser = await User.create({ ...user, role });

    if (!newUser) throw new Error("Failed to create user.");

    const data = JSON.parse(JSON.stringify(newUser));

    revalidatePath("/");
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function updateUser(
  params: UpdateUserParams
): Promise<DefaultResult> {
  const { userId, firstName, lastName, photo, role } = params;

  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const updateFields: any = {};

    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (photo) updateFields.photo = photo;
    if (role) updateFields.role = role;

    const updatedUser = await populateUser(
      User.findByIdAndUpdate(userId, updateFields, { new: true })
    );

    if (!updatedUser) throw new Error("User not found.");

    const data = JSON.parse(JSON.stringify(updatedUser));
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function getUserByUserId(userId: string): Promise<DefaultResult> {
  try {
    await connectToDb();

    const foundUser = await populateUser(User.findById(userId));

    if (!foundUser) throw new Error("User not found.");

    const data = JSON.parse(JSON.stringify(foundUser));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function getUserByClerkId(
  clerkId: string
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const foundUser = await populateUser(User.findOne({ clerkId }));

    if (!foundUser) throw new Error("User not found.");

    const data = JSON.parse(JSON.stringify(foundUser));

    revalidatePath("/");
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function blockUser(
  userId: string,
  path?: string
): Promise<BlockResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const user = await User.findById(userId);

    const isManager = user.role === "Manager";

    if (isManager)
      throw new Error("Are you trying to block your Manager ????!!.");

    const blockedUser = await User.findByIdAndUpdate(
      userId,
      { blocked: true, reviews: [], role: "User" },
      { new: true }
    );

    if (!blockedUser) throw new Error("Failed to block the user.");

    const url = `https://api.clerk.com/v1/users/${blockedUser.clerkId}/ban`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    };
    await fetch(url, options);

    await Career.deleteMany({ createdBy: userId });
    await Quote.deleteMany({ createdBy: userId });
    await Review.deleteMany({ createdBy: userId });

    const comments = await Comment.find({ createdBy: userId });
    for (const comment of comments) {
      await Review.updateOne(
        { _id: comment.review },
        { $pull: { comments: comment._id } }
      );
      await Comment.findByIdAndDelete(comment._id);
    }

    const data = JSON.parse(JSON.stringify(blockedUser));

    if (path) revalidatePath(path);
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function unBlockUser(userId: string): Promise<BlockResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const unBlockedUser = await User.findByIdAndUpdate(
      userId,
      { blocked: false },
      { new: true }
    );

    if (!unBlockedUser) throw new Error("Failed to unblock the user.");

    const url = `https://api.clerk.com/v1/users/${unBlockedUser.clerkId}/unban`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    };

    await fetch(url, options);

    const data = JSON.parse(JSON.stringify(unBlockedUser));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteUser(userId: string): Promise<BlockResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) throw new Error("Failed to delete the user.");

    await Career.deleteMany({ createdBy: userId });
    await Quote.deleteMany({ createdBy: userId });
    await Review.deleteMany({ createdBy: userId });

    const comments = await Comment.find({ createdBy: userId });
    for (const comment of comments) {
      await Review.updateOne(
        { _id: comment.review },
        { $pull: { comments: comment._id } }
      );
      await Comment.findByIdAndDelete(comment._id);
    }

    const data = JSON.parse(JSON.stringify(deletedUser));

    revalidatePath("/");
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}
