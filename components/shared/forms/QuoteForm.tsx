"use client";

import { IUser } from "@/lib/database/models/user.model";
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
import { createQuote } from "@/lib/actions/quote.actions";
import { handleError } from "@/lib/utils";
// import { sendEmail } from "@/app/api/send/route";
import DatePicker from "react-datepicker";
import * as z from "zod";
import "react-datepicker/dist/react-datepicker.css";

const QuoteForm = ({ user }: { user: IUser | null }) => {
  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: quoteDefaultValues,
  });

  async function onSubmit(values: z.infer<typeof quoteSchema>) {
    console.log(values);
    try {
      // sendEmail({ ...values, user });
      // form.reset();
    } catch (error) {
      handleError(error);
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
              <FormLabel className="label-style">Number Of Hours</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="input-style text-style"
                  onKeyDown={(evt) =>
                    evt.key.toLowerCase() === "e" && evt.preventDefault()
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
              <FormLabel className="label-style">Number Of Your Kids</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="input-style text-style"
                  onKeyDown={(evt) =>
                    evt.key.toLowerCase() === "e" && evt.preventDefault()
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
              <FormLabel className="label-style">Age Of Youngest Kid</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="input-style text-style"
                  onKeyDown={(evt) =>
                    evt.key.toLowerCase() === "e" && evt.preventDefault()
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
              <FormLabel className="label-style">Age Of Oldest Kid</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="input-style text-style"
                  onKeyDown={(evt) =>
                    evt.key.toLowerCase() === "e" && evt.preventDefault()
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
        >
          REQUEST QUOTE
        </Button>
      </form>
    </Form>
  );
};

export default QuoteForm;
