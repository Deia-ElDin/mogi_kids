"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
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
import { ILogo } from "@/lib/database/models/logo.model";
import { createReview } from "@/lib/actions/review.actions";
import { CreateReviewToast } from "../toasts";
import UpdateBtn from "../btns/UpdateBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import RatingInput from "../helpers/RatingInput";
import * as z from "zod";

type ReviewFormProps = {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  logo: ILogo | null;
};

const ReviewForm = ({ user, setUser, logo }: ReviewFormProps) => {
  const { toast } = useToast();
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [rating, setRating] = useState(0);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: reviewDefaultValues,
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
      const updatedUser = await createReview({
        ...values,
        createdBy: user._id,
      });
      setUser(updatedUser);
      toast({ description: <CreateReviewToast logo={logo} /> });
      setRating(0);
      form.reset();
      setDisplayForm(false);
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <div className="relative">
      <UpdateBtn
        updateTarget="Create Review"
        handleClick={() => setDisplayForm((prev) => !prev)}
      />
      {displayForm && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={`form-style absolute bottom-0`}
          >
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
              text="Create Review"
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      )}
    </div>
  );
};

export default ReviewForm;
