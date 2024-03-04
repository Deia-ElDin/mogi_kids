"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IQuote } from "@/lib/database/models/quote.model";
import { differenceInDays } from "date-fns";
import { formatMongoDbDate } from "@/lib/utils";

type AdminQuotesType = {
  quotes: IQuote[];
};

const AdminQuotes: React.FC<AdminQuotesType> = ({ quotes }) => {
  const [years, setYears] = useState<string[]>([]);

  // useEffect(() => {
  //   quotes.map((quote) => {
  //     const currentYear = quote.createdAt.split("-")[2];
  //     if (!years.includes(currentYear)) {
  //       setYears([...years, currentYear]);
  //     }
  //   });
  // }, [quotes]);

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Days</TableHead>
          <TableHead>Hours</TableHead>
          <TableHead>Kids</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quotes.map((quote, index) => {
          const {
            cstName,
            location,
            to,
            from,
            numberOfHours,
            numberOfKids,
            ageOfKidsFrom,
            ageOfKidsTo,
            createdAt,
          } = quote;
          return (
            <TableRow key={quote._id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="font-medium">{cstName}</TableCell>
              <TableCell className="font-medium">{location}</TableCell>
              <TableCell className="font-medium">
                {differenceInDays(new Date(to), new Date(from)) + 1}
              </TableCell>
              <TableCell className="font-medium">{numberOfHours}</TableCell>
              <TableCell className="font-medium">{numberOfKids}</TableCell>
              <TableCell className="font-medium">
                {ageOfKidsFrom === ageOfKidsTo
                  ? ageOfKidsFrom
                  : `${ageOfKidsFrom} - ${ageOfKidsTo}`}
              </TableCell>
              <TableCell className="font-medium">
                {formatMongoDbDate(createdAt)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default AdminQuotes;
