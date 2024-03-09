"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { quoteSchema } from "@/lib/validators";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { quoteDefaultValues } from "@/constants";
import { handleError, onlyPositiveValues } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { SendQuoteToast } from "../toasts";
import { ILogo } from "@/lib/database/models/logo.model";
import { IUser } from "@/lib/database/models/user.model";
import { createQuote } from "@/lib/actions/quote.actions";
import DatePicker from "react-datepicker";
import * as z from "zod";
import "react-datepicker/dist/react-datepicker.css";

type QuoteForm = {
  logo: ILogo | null;
  user: IUser | null;
};

const QuoteForm: React.FC<QuoteForm> = ({ user, logo }) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: quoteDefaultValues,
  });

  async function onSubmit(values: z.infer<typeof quoteSchema>) {
    try {
      const { success, data, error } = await createQuote({
        ...values,
        createdBy: user ? user._id : null,
      });


    console.log("success", success);
    console.log("data", data);
    console.log("error", error);

      if (!success && error) throw new Error(error);

      if (success && data) {
        form.reset();

        const response = await fetch("/api/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quoteValues: values, quoteId: data._id }),
        });

        if (response.ok) {
          const responseData = await response.json();
          if (responseData.success)
            toast({ description: <SendQuoteToast logo={logo} /> });
          else throw new Error(responseData.error);
        } else throw new Error(`Response Status: ${response.status}`);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Send The Quotation, ${handleError(error)}`,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col md:grid md:grid-cols-2 gap-5 pt-10 pb-32 relative"
      >
        <FormField
          control={form.control}
          name="cstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">Your Name</FormLabel>
              <FormControl>
                <Input {...field} className="input-style text-style" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">Your Location</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="input-style text-style text-center">
                    <SelectValue placeholder="Kindly select your location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                  <SelectItem value="Dubai">Dubai</SelectItem>
                  <SelectItem value="Sharjah">Sharjah</SelectItem>
                  <SelectItem value="Ajman">Ajman</SelectItem>
                  <SelectItem value="Umm Al Quwain">Umm Al Quwain</SelectItem>
                  <SelectItem value="Ras Al Khaimah">Ras Al Khaimah</SelectItem>
                  <SelectItem value="Fujairah">Fujairah</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">Mobile Number</FormLabel>
              <FormControl>
                <Input {...field} className="input-style text-style" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">Email Address</FormLabel>
              <FormControl>
                <Input {...field} className="input-style text-style" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="from"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="label-style">Service Start Date</FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value}
                  onChange={(date: Date) => field.onChange(date)}
                  dateFormat="dd-MM-yyyy"
                  className="input-style text-style w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="label-style">Service End Date</FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value}
                  onChange={(date: Date) => field.onChange(date)}
                  dateFormat="dd-MM-yyyy"
                  className="input-style text-style w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numberOfHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">Number of Hours</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="input-style text-style"
                  onKeyDown={(evt) => {
                    if (
                      evt.key.toLowerCase() === "e" ||
                      evt.key === "-" ||
                      evt.key === "."
                    )
                      evt.preventDefault();
                  }}
                  onInput={(evt) =>
                    ((evt.target as HTMLInputElement).value =
                      onlyPositiveValues(evt))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numberOfKids"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">Number of Your Kids</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="input-style text-style"
                  onKeyDown={(evt) => {
                    if (
                      evt.key.toLowerCase() === "e" ||
                      evt.key === "-" ||
                      evt.key === "."
                    )
                      evt.preventDefault();
                  }}
                  onInput={(evt) =>
                    ((evt.target as HTMLInputElement).value =
                      onlyPositiveValues(evt))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ageOfKidsFrom"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">Age of Youngest Kid</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="input-style text-style"
                  onKeyDown={(evt) => {
                    if (
                      evt.key.toLowerCase() === "e" ||
                      evt.key === "-" ||
                      evt.key === "."
                    )
                      evt.preventDefault();
                  }}
                  onInput={(evt) =>
                    ((evt.target as HTMLInputElement).value =
                      onlyPositiveValues(evt))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ageOfKidsTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">Age of Oldest Kid</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="input-style text-style"
                  onKeyDown={(evt) => {
                    if (
                      evt.key.toLowerCase() === "e" ||
                      evt.key === "-" ||
                      evt.key === "."
                    )
                      evt.preventDefault();
                  }}
                  onInput={(evt) =>
                    ((evt.target as HTMLInputElement).value =
                      onlyPositiveValues(evt))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="extraInfo"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="label-style">
                Anything Else We Should Know?
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="textarea-style text-style" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="form-btn label-style absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          disabled={form.formState.isSubmitting}
        >
          REQUEST QUOTE
        </Button>
      </form>
    </Form>
  );
};

export default QuoteForm;
