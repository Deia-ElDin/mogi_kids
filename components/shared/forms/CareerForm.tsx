"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadThing } from "@/lib/uploadthing";
import { useForm, useFormContext } from "react-hook-form";
import { careerSchema } from "@/lib/validators";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { careerDefaultValues } from "@/constants";
import { toCap, handleError } from "@/lib/utils";
import { PdfUploader } from "../helpers/PdfUploader";
import DatePicker from "react-datepicker";
import * as z from "zod";
import "react-datepicker/dist/react-datepicker.css";

type InputFieldProps = {
  name: string;
  label?: string;
  options?: string[];
};

const CareerForm = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("pdfUploader");

  const form = useForm<z.infer<typeof careerSchema>>({
    resolver: zodResolver(careerSchema),
    defaultValues: careerDefaultValues,
  });

  async function onSubmit(values: z.infer<typeof careerSchema>) {
    let uploadedImgUrl = values.imgUrl;

    try {
      if (files.length > 0) {
        const uploadedImgs = await startUpload(files);

        if (!uploadedImgs)
          throw new Error("Failed to add the image to uploadthing database.");

        uploadedImgUrl = uploadedImgs[0].url;

        // const { success, error } = img?._id
        //   ? await updateGalleryImg({
        //       _id: img?._id,
        //       imgUrl: uploadedImgUrl,
        //       imgSize: uploadedImgs[0].size,
        //     })
        //   : await createGalleryImg({
        //       imgUrl: uploadedImgUrl,
        //       imgSize: uploadedImgs[0].size,
        //     });

        // toast({
        //   description: `Gallery ${
        //     gallery.length > 0 ? "Updated" : "Created"
        //   } Successfully`,
        // });

        // if (success) handleClose();
        // else if (error) throw new Error(error);
      }
    } catch (error) {
      // toast({
      //   variant: "destructive",
      //   title: "Uh oh! Something went wrong.",
      //   description: `Failed to Create The Gallery Image, ${handleError(
      //     error
      //   )}`,
      // });
    }
  }

  const TextInputField: React.FC<InputFieldProps> = ({ name, label }) => {
    const { control } = useFormContext();

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="label-style">
              {label ? toCap(label) : toCap(name)}
            </FormLabel>
            <FormControl>
              <Input {...field} className="input-style text-style" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const DateInputField: React.FC<InputFieldProps> = ({ name, label }) => {
    const { control } = useFormContext();

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="label-style">
              {label ? toCap(label) : toCap(name)}
            </FormLabel>
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
    );
  };

  const RadioInputField: React.FC<InputFieldProps> = ({
    name,
    label,
    options,
  }) => {
    const { control } = useFormContext();

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="label-style">
              {label
                ? label.includes("DHA")
                  ? label
                  : toCap(label)
                : toCap(name)}
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col md:flex-row md:items-center md:gap-5"
              >
                {options &&
                  options.map((option) => (
                    <FormItem
                      key={option}
                      className="flex items-center space-x-1 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={option} />
                      </FormControl>
                      <FormLabel className="font-light text-style">
                        {option}
                      </FormLabel>
                    </FormItem>
                  ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const TextAreaField: React.FC<InputFieldProps> = ({ name, label }) => {
    const { control } = useFormContext();

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel className="label-style">
              {label
                ? label.includes("UAE")
                  ? label
                  : toCap(label)
                : toCap(name)}
            </FormLabel>
            <FormControl>
              <Textarea {...field} className="textarea-style text-style" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const CvField: React.FC = () => {
    const { control } = useFormContext();

    return (
      <FormField
        control={control}
        name="imgUrl"
        render={({ field }) => (
          <FormItem className="flex flex-col items-start">
            <FormLabel className="label-style">Resume</FormLabel>
            <FormControl>
              <PdfUploader
                imageUrl={field.value}
                onFieldChange={field.onChange}
                setFiles={setFiles}
                imgClass="max-w-[300px] max-h-[300px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const FormBtn: React.FC = () => {
    return (
      <div className="w-full flex justify-center md:col-span-2">
        <Button
          type="submit"
          className="form-btn label-style"
          disabled={form.formState.isSubmitting}
        >
          SUBMIT APPLICATION
        </Button>
      </div>
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col md:grid md:grid-cols-2 gap-5 pt-10 relative"
      >
        <TextInputField name="fullName" />
        <TextInputField name="email" label="email address" />
        <TextInputField name="mobile" label="mobile number" />
        <TextInputField name="workingAt" />
        <TextInputField name="applyingFor" />
        <DateInputField name="joinDate" label="Expected Joining Date" />
        <TextInputField
          name="previousSalary"
          label="Current / Previous Salary"
        />
        <TextInputField name="expectedSalary" />
        <RadioInputField name="gender" options={["Male", "Female"]} />
        <RadioInputField
          name="education"
          options={["Bachelor", "Diploma", "Other"]}
        />
        <RadioInputField
          name="dhaCertificate"
          label="Have A Valid DHA Certificate Or Eligibility?"
          options={["Yes", "No"]}
        />
        <RadioInputField
          name="careGiverCertificate"
          label="Have a valid Care Giver certificate or eligibility?"
          options={["Yes", "No"]}
        />
        <RadioInputField
          name="visa"
          label="Have a valid visa?"
          options={["Yes", "No"]}
        />
        <DateInputField name="visaExpireDate" label="Visa Expiry Date" />
        <TextAreaField name="experienceInUAE" label="Experience In UAE" />
        <TextAreaField name="coverLetter" />
        <CvField />
        {/* <FormField
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
        /> */}
        {/* <FormField
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
        /> */}
        {/* <FormField
          control={form.control}
          name="applyingFor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">Applying for</FormLabel>
              <FormControl>
                <Input {...field} className="input-style text-style" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          name="workingAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">
                Currently working at
              </FormLabel>
              <FormControl>
                <Input {...field} className="input-style text-style" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          name="previousSalary"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">
                Current / Previous Salary
              </FormLabel>
              <FormControl>
                <Input {...field} className="input-style text-style" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expectedSalary"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">Expected Salary</FormLabel>
              <FormControl>
                <Input {...field} className="input-style text-style" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          name="joinDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="label-style">
                Expected joining date
              </FormLabel>
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
        /> */}
        {/* <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="label-style">
                Have a valid Care Giver certificate or eligibility?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Male" />
                    </FormControl>
                    <FormLabel className="font-normal">Male</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Female" />
                    </FormControl>
                    <FormLabel className="font-normal">Female</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="label-style">Your Education</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Bachelor" />
                    </FormControl>
                    <FormLabel className="font-normal">Bachelor</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Diploma" />
                    </FormControl>
                    <FormLabel className="font-normal">Diploma</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Post Graduate" />
                    </FormControl>
                    <FormLabel className="font-normal">Post Graduate</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Other" />
                    </FormControl>
                    <FormLabel className="font-normal">Other</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dhaCertificate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="label-style">
                Have a valid DHA certificate or eligibility?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="No" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          name="careGiverCertificate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="label-style">
                Have a valid Care Giver certificate or eligibility?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="No" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          name="visa"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="label-style">Have a valid Visa?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Yes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="No" />
                    </FormControl>
                    <FormLabel className="font-normal">No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          name="visaExpireDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="label-style">Visa Expiry Date</FormLabel>
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
        /> */}
        {/* <FormField
          control={form.control}
          name="experienceInUAE"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="label-style">Experience in UAE</FormLabel>
              <FormControl>
                <Textarea {...field} className="textarea-style text-style" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="label-style">Cover letter</FormLabel>
              <FormControl>
                <Textarea {...field} className="textarea-style text-style" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imgUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">Image</FormLabel>
              <FormControl>
                <PdfUploader
                  imageUrl={field.value}
                  onFieldChange={field.onChange}
                  setFiles={setFiles}
                  imgClass="max-w-[300px] max-h-[300px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <div className="w-full flex justify-center md:col-span-2">
          <Button
            type="submit"
            className="form-btn label-style"
            disabled={form.formState.isSubmitting}
          >
            SUBMIT APPLICATION
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CareerForm;
