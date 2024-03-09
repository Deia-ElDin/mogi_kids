"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";
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
import { createApplication } from "@/lib/actions/application.actions";
import DatePicker from "react-datepicker";
import * as z from "zod";
import "react-datepicker/dist/react-datepicker.css";
import { type } from "os";

type InputFieldProps = {
  name: string;
  label?: string;
  options?: string[];
};

const CareerForm = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("pdfUploader");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof careerSchema>>({
    resolver: zodResolver(careerSchema),
    defaultValues: careerDefaultValues,
  });

  const handleClose = () => {
    form.reset();
    setFiles([]);
  };

  async function onSubmit(values: z.infer<typeof careerSchema>) {
    let uploadedImgUrl = values.imgUrl;

    try {
      if (files.length > 0) {
        const uploadedImgs = await startUpload(files);

        if (!uploadedImgs)
          throw new Error("Failed to add your resume to uploadthing database.");

        uploadedImgUrl = uploadedImgs[0].url;
        console.log("values", values);

        const { success, error } = await createApplication({ ...values });

        toast({ description: "Application Created Successfully." });

        if (success) handleClose();
        else if (error) throw new Error(error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Create The Application, ${handleError(error)}`,
      });
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
                className="input-style text-style w-full p-0"
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

  const ExperienceInputField: React.FC<InputFieldProps> = ({ name, label }) => {
    const { control } = useFormContext();
    const [inputs, setInputs] = useState<string[]>(
      form.getValues().experienceInUAE
    );

    const handleExperienceInputChange = (index: number, value: string) => {
      const updatedInputs = [...inputs];
      updatedInputs[index] = value;
      setInputs(updatedInputs);
    };

    useEffect(() => {
      form.setValue("experienceInUAE", inputs);
    }, [inputs]);

    return (
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem className="col-span-2">
            <FormLabel className="label-style">
              {label
                ? label.includes("UAE")
                  ? label
                  : label.toUpperCase()
                : name.toUpperCase()}
            </FormLabel>
            {inputs.map((value, index) => (
              <FormControl key={index}>
                <Input
                  value={value}
                  onChange={(e) =>
                    handleExperienceInputChange(index, e.target.value)
                  }
                  placeholder={`${index + 1}.`}
                  className="input-style text-style2 text-left"
                />
              </FormControl>
            ))}
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
                files={files}
                setFiles={setFiles}
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
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">{toCap("fullName")}</FormLabel>
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
              <FormLabel className="label-style">
                {toCap("email address")}
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
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">
                {toCap("mobile number")}
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
          name="workingAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">
                {toCap("workingAt")}
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
          name="applyingFor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">
                {toCap("applyingFor")}
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
          name="joinDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="label-style">
                {" "}
                {toCap("Expected Joining Date")}
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

        <FormField
          control={form.control}
          name="previousSalary"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-style">
                {toCap("Current / Previous Salary")}
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
              <FormLabel className="label-style">
                {toCap("expectedSalary")}
              </FormLabel>
              <FormControl>
                <Input {...field} className="input-style text-style" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <RadioInputField name="gender" options={["Male", "Female"]} />
        <RadioInputField
          name="education"
          options={["Bachelor", "Diploma", "Other"]}
        />
        <RadioInputField
          name="dhaCertificate"
          label="Do You Have A Valid DHA Certificate?"
          options={["Yes", "No"]}
        />
        <RadioInputField
          name="careGiverCertificate"
          label="Do You Have a valid Care Giver certificate?"
          options={["Yes", "No"]}
        />
        <RadioInputField
          name="visa"
          label="Do You Have a valid visa?"
          options={["Yes", "No"]}
        />
        <DateInputField name="visaExpireDate" label="Visa Expiry Date" />
        <ExperienceInputField
          name="experienceInUAE"
          label="Experience In UAE"
        />

        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="label-style">
                {toCap("coverLetter")}
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="textarea-style text-style" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <CvField />
        <FormBtn />
      </form>
    </Form>
  );
};

export default CareerForm;
