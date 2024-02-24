import React from "react";
import { formatDate } from "@/lib/utils";

export interface EmailTemplateProps {
  cstName: string;
  location?: string;
  mobile: string;
  email: string;
  from: Date;
  to: Date;
  numberOfHours: string;
  numberOfKids: string;
  ageOfKidsFrom: string;
  ageOfKidsTo: string;
  extraInfo?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  cstName,
  location,
  mobile,
  email,
  from,
  to,
  numberOfHours,
  numberOfKids,
  ageOfKidsFrom,
  ageOfKidsTo,
  extraInfo,
}) => {
  return (
    <div>
      <h1>Customer: {cstName}.</h1>
      <p>Location: {location}</p>
      <p>Mobile: {mobile}</p>
      <p>Email: {email}</p>
      <p>From Date: {formatDate(from)}</p>
      <p>To Date: {formatDate(to)}</p>
      <p>Number of Hours: {numberOfHours}</p>
      <p>Number of Kids: {numberOfKids}</p>
      <p>Age of Youngest Kid: {ageOfKidsFrom}</p>
      <p>Age of Oldest Kid: {ageOfKidsTo}</p>
      <p>Extra Info: {extraInfo}</p>
    </div>
  );
};
