"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAllQuotes,
  getDayQuotes,
  getMonthQuotes,
  getCstNameQuotes,
  deleteQuote,
  deleteSelectedQuotes,
  markQuoteAsSeen,
  countUnseenQuotes,
} from "@/lib/actions/quote.actions";
import { blockUser } from "@/lib/actions/user.actions";
import { IQuote } from "@/lib/database/models/quote.model";
import { differenceInDays } from "date-fns";
import { formatMongoDbDate, sortQuotes, handleError } from "@/lib/utils";
import { SortKey } from "@/constants";
import UpdateBtn from "../btns/UpdateBtn";
import PagePagination from "../helpers/PagePagination";
import DatePicker from "react-datepicker";
import UserDeleteBtn from "../btns/UserDeleteBtn";
import QuoteCard from "../cards/QuoteCard";
import "react-datepicker/dist/react-datepicker.css";

type QuotePageProps = {
  setUnseenQuotes: React.Dispatch<React.SetStateAction<number | null>>;
};

const QuotePage: React.FC<QuotePageProps> = ({ setUnseenQuotes }) => {
  const limit = 10;
  const [fetchByCstName, setFetchByCstName] = useState<string>("");
  const [fetchByDay, setFetchByDay] = useState<Date | null>(null);
  const [fetchByMonth, setFetchByMonth] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [quotes, setQuotes] = useState<IQuote[] | []>([]);
  const [quotesActions, setQuotesActions] = useState<
    { _id: string; checked: boolean }[]
  >([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: string;
  } | null>(null);

  const { toast } = useToast();

  const handleCstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFetchByCstName(e.target.value);
    if (fetchByDay) setFetchByDay(null);
    if (fetchByMonth) setFetchByMonth(null);
  };

  const handleDayChange = (date: Date | null) => {
    setFetchByDay(date);
    if (fetchByCstName) setFetchByCstName("");
    if (fetchByMonth) setFetchByMonth(null);
  };

  const handleMonthChange = (date: Date | null) => {
    setFetchByMonth(date);
    if (fetchByCstName) setFetchByCstName("");
    if (fetchByDay) setFetchByDay(null);
  };

  const handleDeleteQuote = async (quoteId: string) => {
    try {
      const { success, error } = await deleteQuote(quoteId);
      if (!success && error) throw new Error(error);
      if (fetchByCstName) setFetchByCstName("");
      if (fetchByDay) setFetchByDay(null);
      if (fetchByMonth) setFetchByMonth(null);
      setQuotes((prevQuotes) =>
        prevQuotes.filter((quote) => quote._id !== quoteId)
      );
      setQuotesActions((prevQuotesActions) =>
        prevQuotesActions.filter((quote) => quote._id !== quoteId)
      );
      toast({ description: "Quotation Deleted Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete The Quotation, ${handleError(error)}`,
      });
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      const { success, error } = await blockUser(userId);
      if (!success && error) throw new Error(error);
      toast({ description: "User Blocked Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Block The User, ${handleError(error)}`,
      });
    }
  };

  const handleSelectQuote = async (quoteId: string) => {
    setQuotesActions((prev) =>
      prev.map((quote) =>
        quote._id === quoteId ? { ...quote, checked: !quote.checked } : quote
      )
    );
    const isExist = selectedQuotes.find((id) => id === quoteId);
    setSelectedQuotes((prev) =>
      isExist ? prev.filter((id) => id !== quoteId) : [...prev, quoteId]
    );

    const selected = quotes.find((quote) => quote._id === quoteId);

    if (selected && !selected.seen) {
      const { success, data, error } = await markQuoteAsSeen(quoteId);
      console.log("data", data);

      if (!success && error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Failed to Update The Quotation, ${handleError(error)}`,
        });
      }

      if (data) {
        setQuotes(
          quotes.map((quote) => (quote._id === quoteId ? data : quote))
        );
      }

      fetchUnseenQuotesNumber();
    }
  };

  const handleSelectAll = () => {
    setSelectedQuotes(quotes.map((quote) => quote._id));
    setQuotesActions((prev) =>
      prev.map((quote) => ({
        ...quote,
        checked: !selectAll,
      }))
    );
    setSelectAll((prev) => !prev);
  };

  const handleDeleteSelectedQuotes = async () => {
    try {
      const { success, error } = await deleteSelectedQuotes(selectedQuotes);
      if (!success && error) throw new Error(error);
      toast({ description: "Quotation Selection Deleted Successfully." });

      if (quotes.length === selectedQuotes.length) {
        setStates([]);
      } else {
        const newQuotes = quotes.filter(
          (quote) => !selectedQuotes.includes(quote._id)
        );
        setStates(newQuotes);
      }
      setSelectedQuotes([]);
      setSelectAll(false);
      if (fetchByCstName) setFetchByCstName("");
      if (fetchByDay) setFetchByDay(null);
      if (fetchByMonth) setFetchByMonth(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete The Quotation Selection, ${handleError(
          error
        )}`,
      });
    }
  };

  const setStates = (data: IQuote[], allPages: number = 1) => {
    setQuotes(data || []);
    setTotalPages(allPages);
    setQuotesActions(
      data?.map((quote: IQuote) => ({
        _id: quote._id,
        checked: false,
      })) || []
    );
  };

  const fetchUnseenQuotesNumber = async () => {
    try {
      const { success, data, error } = await countUnseenQuotes();
      if (!success && error) throw new Error(error);
      if (data) setUnseenQuotes(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${handleError(error)}`,
      });
    }
  };

  const fetchAllQuotes = async () => {
    if (fetchByCstName) setFetchByCstName("");
    if (fetchByDay) setFetchByDay(null);
    if (fetchByMonth) setFetchByMonth(null);

    try {
      const { success, data, totalPages, error } = await getAllQuotes({
        limit,
        page: currentPage,
      });

      if (!success && error) throw new Error(error);
      if (success && data) setStates(data, totalPages);
      else {
        setStates([]);
        toast({
          variant: "destructive",
          title: "Uh oh! We couldn't find any Quotations yet in the Database.",
        });
      }
    } catch (error) {
      setStates([]);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to fetch The Quotations, ${handleError(error)}`,
      });
    }
  };

  const fetchCstNameQuests = async (cstName: string) => {
    try {
      const { success, data, error } = await getCstNameQuotes(cstName);

      if (!success && error) throw new Error(error);
      if (success && data) setStates(data);
      else {
        setStates([]);
        toast({
          variant: "destructive",
          title: `Uh oh! We couldn't find any Quotations created by ${cstName}.`,
        });
      }
    } catch (error) {
      setStates([]);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to fetch The Quotations, ${handleError(error)}`,
      });
    }
  };

  const fetchDayQuotes = async (day: Date) => {
    try {
      const { success, data, error } = await getDayQuotes(day);

      if (!success && error) throw new Error(error);
      if (success && data) setStates(data);
      else {
        setStates([]);
        toast({
          variant: "destructive",
          title: `Uh oh! We couldn't find any Quotations create at ${format(
            day,
            "EEE, dd/MM/yyyy"
          )}.`,
        });
      }
    } catch (error) {
      setStates([]);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to fetch The Quotations, ${handleError(error)}`,
      });
    }
  };

  const fetchMonthQuotes = async (month: Date) => {
    try {
      const { success, data, error } = await getMonthQuotes(month);

      if (!success && error) throw new Error(error);
      if (success && data) setStates(data);
      else {
        setStates([]);
        toast({
          variant: "destructive",
          title: `Uh oh! We couldn't find any Quotations create during this ${format(
            month,
            "MMMM MM/yyyy"
          )}.`,
        });
      }
    } catch (error) {
      setStates([]);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to fetch The Quotations, ${handleError(error)}`,
      });
    }
  };

  const requestSort = (key: SortKey) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    fetchAllQuotes();
    fetchUnseenQuotesNumber();
  }, [currentPage]);

  useEffect(() => {
    if (sortConfig) {
      const sortedQuotes = sortQuotes(
        quotes,
        sortConfig.key,
        sortConfig.direction
      );
      setQuotes(sortedQuotes);
      setQuotesActions(
        sortedQuotes?.map((quote: IQuote) => ({
          _id: quote._id,
          checked: false,
        })) || []
      );
    }
  }, [sortConfig]);

  useEffect(() => {
    if (fetchByCstName) fetchCstNameQuests(fetchByCstName);
    else if (fetchByDay) fetchDayQuotes(fetchByDay);
    else if (fetchByMonth) fetchMonthQuotes(fetchByMonth);
  }, [fetchByCstName, fetchByDay, fetchByMonth]);

  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) pageNumbers.push(i + 1);

  const isSelected = quotesActions.some(
    (selectedQuote) => selectedQuote.checked
  );

  const FetchAllQuotesComp = () => (
    <UpdateBtn
      updateTarget="Fetch All Quotation"
      handleClick={fetchAllQuotes}
    />
  );

  const FetchingComp = () => (
    <div className="flex flex-col md:flex-row justify-between gap-2 w-full">
      <input
        type="text"
        className="fetch-input-style text-style"
        placeholder="Fetch By Client Name"
        value={fetchByCstName}
        onChange={handleCstNameChange}
      />
      <DatePicker
        selected={fetchByMonth}
        onChange={handleMonthChange}
        dateFormat="MM-yyyy"
        showMonthYearPicker
        placeholderText="Fetch By Month"
        className="fetch-input-style text-style w-full"
      />
      <DatePicker
        selected={fetchByDay}
        onChange={handleDayChange}
        dateFormat="dd-MM-yyyy"
        placeholderText="Fetch By Day"
        className="fetch-input-style text-style w-full"
      />
    </div>
  );

  const TableHeaderComp = () => (
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
        {[
          { label: "Days", key: SortKey.DAYS },
          { label: "Hours", key: SortKey.HOURS },
          { label: "Kids", key: SortKey.KIDS },
          { label: "Age", key: SortKey.AGES },
          { label: "Total Hours", key: SortKey.TOTAL_HOURS },
          { label: "Date", key: SortKey.DATE },
        ].map((item) => (
          <TableHead
            key={item.label}
            className="table-head"
            onClick={() => requestSort(item.key)}
          >
            {item.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );

  const TableBodyComp = () => (
    <TableBody>
      {quotes.map((quote, index) => {
        const {
          _id,
          cstName,
          location,
          to,
          from,
          numberOfHours,
          numberOfKids,
          ageOfKidsFrom,
          ageOfKidsTo,
          createdAt,
          seen,
        } = quote;
        const totalDays = differenceInDays(new Date(to), new Date(from)) + 1;
        const totalHours = totalDays * parseInt(numberOfHours);

        return (
          <React.Fragment key={_id}>
            <TableRow
              className={`cursor-pointer ${seen ? "" : "text-blue-500"}`}
              onClick={() => handleSelectQuote(_id)}
            >
              <TableCell className="table-cell text-center ">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer"
                  checked={quotesActions[index].checked}
                  onChange={(e) => e.stopPropagation()}
                />
              </TableCell>
              {[
                { style: "table-cell", label: cstName },
                {
                  style: `table-cell ${
                    location === "Abu Dhabi" ? "" : "text-red-500"
                  }`,
                  label: location,
                },
                { style: "table-cell", label: totalDays },
                { style: "table-cell", label: numberOfHours },
                { style: "table-cell", label: numberOfKids },
                {
                  style: "table-cell",
                  label:
                    ageOfKidsFrom === ageOfKidsTo
                      ? ageOfKidsFrom
                      : `${ageOfKidsFrom} - ${ageOfKidsTo}`,
                },
                { style: "table-cell", label: totalHours },
                { style: "table-cell", label: formatMongoDbDate(createdAt) },
              ].map((item, index) => (
                <TableCell
                  key={`${_id} - ${item.label} - ${index}`}
                  className={item.style}
                >
                  {item.label}
                </TableCell>
              ))}
            </TableRow>

            {quotesActions[index].checked && (
              <QuoteCard
                quote={quote}
                handleDeleteQuote={handleDeleteQuote}
                handleBlockUser={handleBlockUser}
              />
            )}
          </React.Fragment>
        );
      })}
    </TableBody>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-5 items-center text-bold">
        <FetchAllQuotesComp />
        <FetchingComp />
      </div>

      <Table className="w-full">
        <TableHeaderComp />
        <TableBodyComp />
      </Table>

      <PagePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageNumbers={pageNumbers}
        setCurrentPage={setCurrentPage}
      />

      {isSelected && (
        <UserDeleteBtn
          deletionTarget="Delete Selected Quotations"
          handleClick={handleDeleteSelectedQuotes}
        />
      )}
    </div>
  );
};

export default QuotePage;
