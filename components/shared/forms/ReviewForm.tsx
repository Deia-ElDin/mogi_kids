"use client";

import { useState, useEffect } from "react";
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
import { reviewSchema } from "@/lib/validators";
import { reviewDefaultValues } from "@/constants";
import { handleError } from "@/lib/utils";
import { IUser } from "@/lib/database/models/user.model";
import { IReview } from "@/lib/database/models/review.model";
import { createReview, updateReview } from "@/lib/actions/review.actions";
import AddBtn from "../btns/AddBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import RatingInput from "../helpers/RatingInput";
import * as z from "zod";

type ReviewFormProps = {
  user: IUser;
  reviewObj: IReview | null;
};

const ReviewForm = ({ user, reviewObj }: ReviewFormProps) => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [rating, setRating] = useState(0);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: reviewObj ? reviewObj : reviewDefaultValues,
  });

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") {
        setDisplayForm(false);
        setRating(0);
        form.reset();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function onSubmit(values: z.infer<typeof reviewSchema>) {
    values.rating = String(rating);

    try {
      if (reviewObj?._id) await updateReview({ ...values, _id: reviewObj._id });
      else await createReview({ ...values, createdBy: user._id });
      setDisplayForm(false);
      form.reset();
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <>
      <AddBtn handleClick={() => setDisplayForm((prev) => !prev)} />
      {displayForm && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="form-style">
            <CloseBtn handleClick={() => setDisplayForm(false)} />
            <h1 className="title-style text-white">Review Form</h1>
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-style">Review</FormLabel>
                  <FormControl>
                    <Input {...field} className="edit-input-style text-style" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="rating"
              render={() => (
                <div>
                  <FormLabel className="label-style">Rating</FormLabel>
                  <RatingInput rating={rating} setRating={setRating} />
                </div>
              )}
            />
            <FormBtn
              text={`${reviewObj?._id ? "Edit" : "Submit"} Review`}
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      )}
    </>
  );
};

export default ReviewForm;
