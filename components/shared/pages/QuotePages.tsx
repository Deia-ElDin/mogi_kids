"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllQuotes } from "@/lib/actions/quote.actions";
import { IQuote } from "@/lib/database/models/quote.model";
import { differenceInDays } from "date-fns";
import { formatMongoDbDate } from "@/lib/utils";
import PagePagination from "../helpers/PagePagination";
import IconDeleteBtn from "../btns/IconDeleteBtn";
import DatePicker from "react-datepicker";
import Text from "../helpers/Text";
import "react-datepicker/dist/react-datepicker.css";

const QuotePages = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [quotes, setQuotes] = useState<IQuote[] | []>([]);
  const [selectedQuotes, setSelectedQuotes] = useState<
    { _id: string; checked: boolean; deleteBtn: boolean }[]
  >([]);
  const limit = 2;

  useEffect(() => {
    const fetchQuotes = async (page: number) => {
      const quotesResult = await getAllQuotes({ limit, page });

      if (quotesResult.success) {
        setQuotes(quotesResult.data || []);
        setTotalPages(quotesResult.totalPages || 1);
        setSelectedQuotes(
          quotesResult.data?.map((quote) => ({
            _id: quote._id,
            checked: false,
            deleteBtn: false,
          })) || []
        );
      }
    };

    fetchQuotes(currentPage);
  }, [currentPage]);

  const handleDayChange = (date: Date | null) => {
    setSelectedDate(date); // Update selected date state
  };

  const handleMonthChange = (date: Date | null) => {
    setSelectedMonth(date); // Update selected date state
  };

  const handleSelectQuote = (quoteId: string) => {
    setSelectedQuotes((prev) =>
      prev.map((quote) =>
        quote._id === quoteId
          ? { ...quote, checked: !quote.checked, deleteBtn: !quote.deleteBtn }
          : quote
      )
    );
  };

  const handleSelectAll = () => {
    setSelectedQuotes((prev) =>
      prev.map((quote) => ({ ...quote, checked: true, deleteBtn: true }))
    );
  };

  console.log("selectedQuotes", selectedQuotes);

  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) pageNumbers.push(i + 1);

  const isSelected = selectedQuotes.some(
    (selectedQuote) => selectedQuote.checked
  );

  console.log("isSelected", isSelected);

  return (
    <>
      <div className="flex flex-col gap-5 items-center text-bold">
        <Text text="Fetch Quotation" />
        <div className="flex justify-between gap-2">
          <input
            type="text"
            className="input-style text-style"
            placeholder="By Client Name"
          />
          <DatePicker
            selected={selectedDate}
            onChange={handleDayChange}
            dateFormat="dd-MM-yyyy"
            placeholderText="By Day"
            className="input-style text-style"
          />
          <DatePicker
            selected={selectedMonth}
            onChange={handleMonthChange}
            dateFormat="MM-yyyy"
            showMonthYearPicker
            placeholderText="By Month"
            className="input-style text-style"
          />
        </div>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="table-head" onClick={handleSelectAll}>
              Select All
            </TableHead>
            <TableHead className="table-head">Client</TableHead>
            <TableHead className="table-head">Location</TableHead>
            <TableHead className="table-head">Days</TableHead>
            <TableHead className="table-head">Hours</TableHead>
            <TableHead className="table-head">Kids</TableHead>
            <TableHead className="table-head">Age</TableHead>
            <TableHead className="table-head">Date</TableHead>
            {isSelected && <TableHead className="table-head">Delete</TableHead>}
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
              <TableRow key={quote._id} className="cursor-pointer">
                <TableCell className="table-cell text-center">
                  <input
                    type="checkbox"
                    className="h-[18px] w-[18px]"
                    checked={selectedQuotes[index].checked}
                    onChange={() => handleSelectQuote(quote._id)}
                  />
                </TableCell>
                <TableCell className="table-cell">{cstName}</TableCell>
                <TableCell className="table-cell">{location}</TableCell>
                <TableCell className="table-cell">
                  {differenceInDays(new Date(to), new Date(from)) + 1}
                </TableCell>
                <TableCell className="table-cell">{numberOfHours}</TableCell>
                <TableCell className="table-cell">{numberOfKids}</TableCell>
                <TableCell className="table-cell">
                  {ageOfKidsFrom === ageOfKidsTo
                    ? ageOfKidsFrom
                    : `${ageOfKidsFrom} - ${ageOfKidsTo}`}
                </TableCell>
                <TableCell className="table-cell">
                  {formatMongoDbDate(createdAt)}
                </TableCell>
                <TableCell className="px-0 py-3 flex justify-center items-center">
                  {selectedQuotes[index].checked && (
                    <IconDeleteBtn
                      deletionTarget="Quotation"
                      handleClick={() => console.log("Delete")}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <PagePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageNumbers={pageNumbers}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default QuotePages;
