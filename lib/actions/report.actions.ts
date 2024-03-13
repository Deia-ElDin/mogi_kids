// "use server";

// import { connectToDb } from "../database";
// import {
//   validateAdmin,
//   validatePageAndLimit,
//   validateIsTheSameUser,
// } from "./validation.actions";
// import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
// import {
//   CreateReportParams,
//   GetAllReportsParams,
//   DeleteSelectedReportParams,
//   DeleteSelectedReportsParams,
// } from "@/types";
// import { handleError } from "../utils";
// import Report, { IReport } from "../database/models/report.model";

// type CountResult = {
//   success: boolean;
//   data: number | null;
//   error: string | null;
// };

// type GetAllResult = {
//   success: boolean;
//   data: IReport[] | [] | null;
//   totalPages?: number;
//   unseen?: number | null;
//   error: string | null;
// };

// type DefaultResult = {
//   success: boolean;
//   data: IReport | null;
//   error: string | null;
// };

// type DeleteResult = {
//   success: boolean;
//   data: IReport[] | [] | null;
//   totalPages?: number;
//   error: string | null;
// };

// export async function createReport(
//   params: CreateReportParams
// ): Promise<DefaultResult> {
//   try {
//     await connectToDb();

//     if (params.createdBy) {
//       const { isTheSameUser, error } = await validateIsTheSameUser(
//         params.createdBy
//       );

//       if (error || !isTheSameUser)
//         throw new Error("Not Authorized to access this resource.");
//     }

//     const newReport = await Career.create(params);

//     if (!newReport) throw new Error("Failed to create the report.");

//     const data = JSON.parse(JSON.stringify(newReport));

//     return { success: true, data, error: null };
//   } catch (error) {
//     return { success: false, data: null, error: handleError(error) };
//   }
// }

// export async function countUnseenReports(): Promise<CountResult> {
//   try {
//     await connectToDb();

//     const { isAdmin, error } = await validateAdmin();

//     if (error || !isAdmin)
//       throw new Error("Not Authorized to access this resource.");

//     const count = await Career.countDocuments({ seen: false });

//     revalidatePath("/");
//     return { success: true, data: count, error: null };
//   } catch (error) {
//     return { success: false, data: null, error: handleError(error) };
//   }
// }

// export async function getAllReports({
//   fetch,
//   limit = 10,
//   page = 1,
// }: GetAllReportsParams): Promise<GetAllResult> {
//   try {
//     validatePageAndLimit(page, limit);

//     await connectToDb();

//     const { isAdmin, error } = await validateAdmin();

//     if (error || !isAdmin)
//       throw new Error("Not Authorized to access this resource.");

//     let condition = {};

//     if (fetch?.applicantName)
//       condition = { fullName: new RegExp(`^${fetch?.applicantName}`, "i") };
//     else if (fetch?.email)
//       condition = { email: new RegExp(`^${fetch?.email}`, "i") };
//     else if (fetch?.day) {
//       const day = new Date(fetch?.day);
//       const startOfTheDay = startOfDay(day);
//       const endOfTheDay = endOfDay(day);
//       condition = { createdAt: { $gte: startOfTheDay, $lt: endOfTheDay } };
//     } else if (fetch?.month) {
//       const month = fetch?.month.getMonth();
//       const year = fetch?.month.getFullYear();
//       const startDate = startOfMonth(new Date(year, month, 1));
//       const endDate = endOfMonth(new Date(year, month, 1));
//       condition = { createdAt: { $gte: startDate, $lte: endDate } };
//     }

//     const skipAmount = (Number(page) - 1) * limit;

//     const reports = await Career.find(condition)
//       .sort({ createdAt: -1 })
//       .skip(skipAmount)
//       .limit(limit)
//       .populate({
//         path: "createdBy",
//         model: "User",
//         select: "_id firstName lastName photo",
//         options: { allowNull: true },
//       });

//     if (!reports) throw new Error("Failed to fetch the quotations.");

//     if (reports.length === 0)
//       return { success: true, data: [], error: null };

//     const totalPages = Math.ceil(
//       (await Career.countDocuments(condition)) / limit
//     );

//     const data = JSON.parse(JSON.stringify(reports));

//     const unseen = await Career.countDocuments({
//       ...condition,
//       seen: false,
//     });

//     return { success: true, data, totalPages, unseen, error: null };
//   } catch (error) {
//     return {
//       success: false,
//       data: null,
//       unseen: null,
//       error: handleError(error),
//     };
//   }
// }

// export async function markReportAsSeen(
//   reportId: string
// ): Promise<DefaultResult> {
//   try {
//     await connectToDb();

//     const { isAdmin, error } = await validateAdmin();

//     if (error || !isAdmin)
//       throw new Error("Not Authorized to access this resource.");

//     const seenReport = await Career.findByIdAndUpdate(
//       reportId,
//       { seen: true },
//       { new: true }
//     );

//     if (!seenReport)
//       throw new Error("Failed to change the seen status of this quotation.");

//     const data = JSON.parse(JSON.stringify(seenReport));

//     return { success: true, data, error: null };
//   } catch (error) {
//     return { success: false, data: null, error: handleError(error) };
//   }
// }

// export async function deleteReport({
//   reportId,
//   page = 1,
//   limit = 10,
// }: DeleteSelectedReportParams): Promise<DeleteResult> {
//   try {
//     validatePageAndLimit(page, limit);

//     await connectToDb();

//     const { isAdmin, error } = await validateAdmin();

//     if (error || !isAdmin)
//       throw new Error("Not Authorized to access this resource.");

//     const deletedReport = await Career.findByIdAndDelete(reportId);

//     if (!deletedReport)
//       throw new Error(
//         "Failed to find the report or the report already deleted."
//       );

//     const skipAmount = (Number(page) - 1) * limit;
//     const reports = await Career.find()
//       .sort({ createdAt: -1 })
//       .skip(skipAmount)
//       .limit(limit)
//       .populate({
//         path: "createdBy",
//         model: "User",
//         select: "_id firstName lastName photo",
//       });

//     if (!reports) throw new Error("Failed to fetch the quotations.");

//     if (reports.length === 0)
//       return { success: true, data: [], error: null };

//     const totalPages = Math.ceil((await Career.countDocuments()) / limit);

//     const data = JSON.parse(JSON.stringify(reports));

//     return { success: true, data, totalPages, error: null };
//   } catch (error) {
//     return { success: false, data: null, error: handleError(error) };
//   }
// }

// export async function deleteSelectedReports({
//   selectedReports,
//   page = 1,
//   limit = 10,
// }: DeleteSelectedReportsParams): Promise<DeleteResult> {
//   try {
//     validatePageAndLimit(page, limit);

//     await connectToDb();

//     const { isAdmin, error } = await validateAdmin();

//     if (error || !isAdmin)
//       throw new Error("Not Authorized to access this resource.");

//     const deletedReports = await Career.deleteMany({
//       _id: { $in: selectedReports },
//     });

//     if (!deletedReports)
//       throw new Error(
//         "Failed to find the reports or the reports already deleted."
//       );

//     const skipAmount = (Number(page) - 1) * limit;
//     const reports = await Career.find()
//       .sort({ createdAt: -1 })
//       .skip(skipAmount)
//       .limit(limit)
//       .populate({
//         path: "createdBy",
//         model: "User",
//         select: "_id firstName lastName photo",
//       });

//     if (!reports) throw new Error("Failed to fetch the quotations.");

//     if (reports.length === 0)
//       return { success: true, data: [], error: null };

//     const totalPages = Math.ceil((await Career.countDocuments()) / limit);

//     const data = JSON.parse(JSON.stringify(reports));

//     return { success: true, data, totalPages, error: null };
//   } catch (error) {
//     return { success: false, data: null, error: handleError(error) };
//   }
// }
