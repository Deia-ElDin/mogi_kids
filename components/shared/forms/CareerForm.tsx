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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { quoteDefaultValues } from "@/constants";
import DatePicker from "react-datepicker";
import * as z from "zod";
import "react-datepicker/dist/react-datepicker.css";

const CareerForm = () => {
  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: quoteDefaultValues,
  });

  function onSubmit(values: z.infer<typeof quoteSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col md:grid md:grid-cols-2 gap-5 pt-10 relative"
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">Full name</FormLabel>
              <FormControl>
                <Input {...field} className="input-style text-style" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">Mobile number</FormLabel>
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
              <FormLabel className="label-style">Your location</FormLabel>
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
              <FormLabel className="label-style">Email address</FormLabel>
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
              <FormLabel className="label-style">From date</FormLabel>
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
              <FormLabel className="label-style">To date</FormLabel>
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
              <FormLabel className="label-style">Number of your kids</FormLabel>
              <FormControl>
                <Input {...field} className="input-style text-style" />
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
              <FormLabel className="label-style">
                Age of your kids from
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="input-style text-style"
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
              <FormLabel className="label-style">Age of your kids to</FormLabel>
              <FormControl>
                <Input {...field} className="input-style text-style" />
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
                Anything else we should know?
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="textarea-style text-style" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-center md:col-span-2">
          <Button type="submit" className="form-btn label-style">
            REQUEST QUOTE
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CareerForm;
