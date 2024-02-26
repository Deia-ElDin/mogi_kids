"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { commentSchema } from "@/lib/validators";
import { commentDefaultValues } from "@/constants";
import { createComment, updateComment } from "@/lib/actions/comment.actions";
import { handleError } from "@/lib/utils";
import { IUser } from "@/lib/database/models/user.model";
import { IComment } from "@/lib/database/models/comment.model";
import { Button } from "@/components/ui/button";
import * as z from "zod";

type CommentFormProps = {
  user: IUser;
  reviewId: string;
  comment: IComment | Partial<IComment> | null;
};

const CommentForm = ({ user, reviewId, comment }: CommentFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: comment ? comment : commentDefaultValues,
  });

  async function onSubmit(values: z.infer<typeof commentSchema>) {
    try {
      const newComment = comment?._id
        ? await updateComment({
            ...values,
            _id: comment._id,
            reviewId,
            createdBy: user._id,
          })
        : await createComment({
            ...values,
            reviewId,
            createdBy: user._id,
          });
      form.reset();
    } catch (error) {
      handleError(error);
    }
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
        <div className="w-full flex justify-end gap-5">
          <Button
            className="bg-transparent hover:bg-transparent text-black rounded-sm border-2 border-gray-300 active:text-xs w-20"
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="bg-gray-100 hover:bg-transparent text-black rounded-sm border-2 border-gray-300 active:text-base w-20"
            type="submit"
          >
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
