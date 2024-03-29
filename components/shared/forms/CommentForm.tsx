"use client";

import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { commentSchema } from "@/lib/validators";
import { commentDefaultValues } from "@/constants";
import { createComment } from "@/lib/actions/comment.actions";
import { handleError } from "@/lib/utils";
import { IUser } from "@/lib/database/models/user.model";
import { Button } from "@/components/ui/button";
import { getUsername } from "@/lib/utils";
import * as z from "zod";

type CommentFormProps = {
  user: IUser;
  reviewId: string;
};

const CommentForm = ({ user, reviewId }: CommentFormProps) => {
  const pathname = usePathname();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: commentDefaultValues,
  });

  async function onSubmit(values: z.infer<typeof commentSchema>) {
    try {
      const validationResult = commentSchema.safeParse(values);

      if (!validationResult.success)
        throw new Error(validationResult.error.message);

      const { success, error } = await createComment({
        ...values,
        reviewId,
        createdBy: user._id,
        path: pathname,
      });

      if (!success && error) {
        if (typeof error === "string") {
          throw new Error(error);
        } else {
          throw error;
        }
      }
      toast({ description: "Comment Created Successfully." });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Create The Comment, ${handleError(error)}`,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full"
      >
        <div className="flex gap-2 items-end">
          <Avatar className="rounded-full h-[40px] w-[40px]">
            <AvatarImage src={user?.photo ?? "/assets/icons/user.svg"} />
          </Avatar>
          <p className="font-bold tracking-wide">
            {getUsername(user.firstName, user.lastName)}
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
            onClick={() => form.reset()}
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
