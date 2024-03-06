"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
} from "@/lib/actions/quote.actions";
import { IQuote } from "@/lib/database/models/quote.model";
import { differenceInDays } from "date-fns";
import { formatMongoDbDate, sortQuotes, handleError } from "@/lib/utils";
import { SortKey } from "@/constants";
import PagePagination from "../helpers/PagePagination";
import IconDeleteBtn from "../btns/IconDeleteBtn";
import DatePicker from "react-datepicker";
import UserDeleteBtn from "../btns/UserDeleteBtn";
import "react-datepicker/dist/react-datepicker.css";

// const selectedId = selectedQuotes.map((quote) => quote._id);

const QuotePages = () => {
  const limit = 10;
  const [fetchByCstName, setFetchByCstName] = useState<string>("");
  const [fetchByDay, setFetchByDay] = useState<Date | null>(null);
  const [fetchByMonth, setFetchByMonth] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [quotes, setQuotes] = useState<IQuote[] | []>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedQuotes, setSelectedQuotes] = useState<
    { _id: string; checked: boolean; deleteBtn: boolean }[]
  >([]);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: string;
  } | null>(null);

  const { toast } = useToast();

  const pathname = usePathname();

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
      const { success, error } = await deleteQuote(quoteId, pathname);
      if (!success && error) throw new Error(error);
      toast({ description: "Quotation Deleted Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete The Quotation, ${handleError(error)}`,
      });
    }
  };

  const handleDeleteSelectedQuotes = async () => {
    try {
      const selectedIds = selectedQuotes.map((quote) => quote._id);

      const { success, error } = await deleteSelectedQuotes(
        selectedIds,
        pathname
      );
      if (!success && error) throw new Error(error);
      toast({ description: "Quotation Selection Deleted Successfully." });
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

  const setStates = (data: IQuote[]) => {
    setQuotes(data || []);
    setTotalPages(totalPages || 1);
    setSelectedQuotes(
      data?.map((quote: IQuote) => ({
        _id: quote._id,
        checked: false,
        deleteBtn: false,
      })) || []
    );
  };

  const fetchAllQuotes = async (page: number) => {
    try {
      const { success, data, error } = await getAllQuotes({ limit, page });

      if (!success && error) throw new Error(error);
      if (success && data) setStates(data);
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
    console.log("fetchDayQuotes -> day", format(day, "dd"));

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
    fetchAllQuotes(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (sortConfig) {
      const sortedQuotes = sortQuotes(
        quotes,
        sortConfig.key,
        sortConfig.direction
      );
      setQuotes(sortedQuotes);
    }
  }, [sortConfig]);

  useEffect(() => {
    if (fetchByCstName) fetchCstNameQuests(fetchByCstName);
    else if (fetchByDay) fetchDayQuotes(fetchByDay);
    else if (fetchByMonth) fetchMonthQuotes(fetchByMonth);
  }, [fetchByCstName, fetchByDay, fetchByMonth]);

  const handleSelectQuote = (quoteId: string) => {
    setSelectedQuotes((prev) =>
      prev.map((quote) =>
        quote._id === quoteId
          ? { ...quote, checked: !quote.checked, deleteBtn: !quote.checked }
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

  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) pageNumbers.push(i + 1);

  const isSelected = selectedQuotes.some(
    (selectedQuote) => selectedQuote.checked
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-5 items-center text-bold">
        <h1 className="text-lg font-bold">Fetch Quotation</h1>
        <div className="flex flex-col md:flex-row justify-between gap-2">
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
            <TableHead
              className="table-head"
              onClick={() => requestSort(SortKey.DAYS)}
            >
              Days
            </TableHead>
            <TableHead
              className="table-head"
              onClick={() => requestSort(SortKey.HOURS)}
            >
              Hours
            </TableHead>
            <TableHead
              className="table-head"
              onClick={() => requestSort(SortKey.KIDS)}
            >
              Kids
            </TableHead>
            <TableHead className="table-head">Age</TableHead>
            <TableHead
              className="table-head"
              onClick={() => requestSort(SortKey.TOTAL_HOURS)}
            >
              Total Hours
            </TableHead>
            <TableHead
              className="table-head"
              onClick={() => requestSort(SortKey.DATE)}
            >
              Date
            </TableHead>
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
                      handleClick={() => handleDeleteQuote(quote._id)}
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

      {isSelected && (
        <UserDeleteBtn
          deletionTarget="Delete Selected Quotations"
          handleClick={handleDeleteSelectedQuotes}
        />
      )}
    </div>
  );
};

export default QuotePages;
