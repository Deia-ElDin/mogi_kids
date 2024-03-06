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
  const [fetchByDay, setFetchByDay] = useState<Date | null>(null);
  const [fetchByMonth, setFetchByMonth] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [quotes, setQuotes] = useState<IQuote[] | []>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
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
    setFetchByDay(date);
  };

  const handleMonthChange = (date: Date | null) => {
    setFetchByMonth(date);
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
      prev.map((quote) => ({
        ...quote,
        checked: !selectAll,
        deleteBtn: !selectAll,
      }))
    );
    setSelectAll((prev) => !prev);
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
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <input
            type="text"
            className="fetch-input-style text-style"
            placeholder="Fetch By Client Name"
          />
          <DatePicker
            selected={fetchByMonth}
            onChange={handleMonthChange}
            dateFormat="MM-yyyy"
            showMonthYearPicker
            placeholderText="Fetch By Month"
            className="fetch-input-style text-style whitespace-nowrap"
          />
          <DatePicker
            selected={fetchByDay}
            onChange={handleDayChange}
            dateFormat="dd-MM-yyyy"
            placeholderText="Fetch By Day"
            className="fetch-input-style text-style whitespace-nowrap"
          />
        </div>
      </div>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="table-head">
              <input
                type="checkbox"
                className="h-[18px] w-[18px]"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="table-head">Client</TableHead>
            <TableHead className="table-head">Location</TableHead>
            <TableHead className="table-head">Days</TableHead>
            <TableHead className="table-head">Hours</TableHead>
            <TableHead className="table-head">Kids</TableHead>
            <TableHead className="table-head">Age</TableHead>
            <TableHead className="table-head">Total Hours</TableHead>
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
            const totalDays =
              differenceInDays(new Date(to), new Date(from)) + 1;
            const totalHours = totalDays * parseInt(numberOfHours);
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
                <TableCell className="table-cell">{totalDays}</TableCell>
                <TableCell className="table-cell">{numberOfHours}</TableCell>
                <TableCell className="table-cell">{numberOfKids}</TableCell>
                <TableCell className="table-cell">
                  {ageOfKidsFrom === ageOfKidsTo
                    ? ageOfKidsFrom
                    : `${ageOfKidsFrom} - ${ageOfKidsTo}`}
                </TableCell>
                <TableCell className="table-cell">{totalHours}</TableCell>
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
