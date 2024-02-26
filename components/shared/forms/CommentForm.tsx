"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { commentSchema } from "@/lib/validators";
import { commentDefaultValues } from "@/constants";
import { handleError } from "@/lib/utils";
import { IUser } from "@/lib/database/models/user.model";
import { IComment } from "@/lib/database/models/comment.model";
import { IReview } from "@/lib/database/models/review.model";
import Text from "../helpers/Text";
import * as z from "zod";

type CommentFormProps = {
  user: IUser | undefined;
  comment: IComment | null;
};

const CommentForm = ({ user, comment }: CommentFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: comment ? comment : commentDefaultValues,
  });

  async function onSubmit(values: z.infer<typeof commentSchema>) {
    // try {
    //   if (review?._id) {
    //     await updateReview({
    //       ...values,
    //       user: user,
    //       _id: review._id,
    //     });
    //   } else await createReview({ ...values, user: user! });
    //   form.reset();
    // } catch (error) {
    //   handleError(error);
    // }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full"
      >
        <div
          className="flex gap-2 items-end cursor-pointer"
          onClick={() => router.push(`/users/${user?._id}`)}
        >
          <Avatar className="rounded-full h-[40px] w-[40px]">
            <AvatarImage src={user?.photo ?? "/assets/icons/user.svg"} />
          </Avatar>
          <p>
            {user?.firstName
              ? user?.firstName + " " + user?.lastName
              : "Customer"}
          </p>
        </div>
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="pl-1">
              <FormControl>
                <Input
                  {...field}
                  className="replay-input-style"
                  placeholder="Add a comment"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CommentForm;
