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
  deleteQuote,
  deleteSelectedQuotes,
  markQuoteAsSeen,
} from "@/lib/actions/quote.actions";
import { blockUser } from "@/lib/actions/user.actions";
import { IQuote } from "@/lib/database/models/quote.model";
import { differenceInDays } from "date-fns";
import { formatDate, sortQuotes, handleError } from "@/lib/utils";
import { QuoteSortKey } from "@/constants";
import UpdateBtn from "../btns/UpdateBtn";
import PagePagination from "../helpers/PagePagination";
import DatePicker from "react-datepicker";
import UserDeleteBtn from "../btns/UserDeleteBtn";
import QuoteCard from "../cards/QuoteCard";
import "react-datepicker/dist/react-datepicker.css";

type QuotesPageProps = {
  setUnseenQuotes: React.Dispatch<React.SetStateAction<number | null>>;
};

type FetchState = {
  cstName?: string;
  email?: string;
  day?: Date | null;
  month?: Date | null;
};

type quotesActionsState = {
  _id: string;
  checked: boolean;
};

const QuotesPage: React.FC<QuotesPageProps> = ({ setUnseenQuotes }) => {
  const limit = 10;
  const [fetchBy, setFetchBy] = useState<FetchState>({
    cstName: "",
    email: "",
    day: null,
    month: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [quotes, setQuotes] = useState<IQuote[] | []>([]);
  const [quotesActions, setQuotesActions] = useState<quotesActionsState[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: QuoteSortKey;
    direction: string;
  } | null>(null);

  const { toast } = useToast();

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
    // we set the quotes actions to opposite of the prev state
    setQuotesActions((prev) =>
      prev.map((quote) =>
        quote._id === quoteId ? { ...quote, checked: !quote.checked } : quote
      )
    );

    // we check if the quote is already in the selected quotes array
    const isExist = selectedQuotes.find((id) => id === quoteId);

    // if it's exist we remove it from the selected quotes array else we add it
    setSelectedQuotes((prev) =>
      isExist ? prev.filter((id) => id !== quoteId) : [...prev, quoteId]
    );

    // we find the selected quote from the quotes array
    const selected = quotes.find((quote) => quote._id === quoteId);

    // if the selected quote is not seen we mark it as seen
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
    }
    if (selectAll) setSelectAll(false);
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

  const handleDeleteQuote = async (quoteId: string) => {
    try {
      const { success, data, totalPages, error } = await deleteQuote({
        quoteId,
        page: currentPage,
        limit,
      });

      if (!success && error) throw new Error(error);

      if (quotes.length === selectedQuotes.length) {
        setStates([]);
      } else {
        const { cstName, email, day, month } = fetchBy;
        if (cstName || email || day || month) {
          const newQuotes = quotes.filter((quote) => quote._id !== quoteId);
          setStates(newQuotes);
        } else if (data) setStates(data, totalPages);
      }

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

  const handleDeleteSelectedQuotes = async () => {
    try {
      const { success, data, totalPages, error } = await deleteSelectedQuotes({
        selectedQuotes,
        page: currentPage,
      });

      if (!success && error) throw new Error(error);
      toast({ description: "Quotation Selection Deleted Successfully." });

      if (quotes.length === selectedQuotes.length) {
        setStates([]);
      } else {
        const { cstName, email, day, month } = fetchBy;
        if (cstName || email || day || month) {
          const newQuotes = quotes.filter(
            (quote) => !selectedQuotes.includes(quote._id)
          );
          setStates(newQuotes);
        } else if (data) setStates(data, totalPages);
      }
      setSelectedQuotes([]);
      setSelectAll(false);
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

  const fetchAllQuotes = async (fetchBy: FetchState) => {
    const { cstName = "", email = "", day = null, month = null } = fetchBy;

    try {
      const { success, data, totalPages, unseen, error } = await getAllQuotes({
        fetch: fetchBy,
        limit,
        page: currentPage,
      });

      if (!success && error) throw new Error(error);
      if (unseen) setUnseenQuotes(unseen);
      if (success && data && data?.length > 0) setStates(data, totalPages);
      else {
        setUnseenQuotes(null);
        let extraMsg = "yet in the Database.";
        if (cstName) extraMsg = `by ${cstName}.`;
        else if (email) extraMsg = `by ${email}.`;
        else if (day) extraMsg = `at ${format(day, "EEE, dd/MM/yyyy")}.`;
        else if (month) extraMsg = `during ${format(month, "MMMM MM/yyyy")}.`;
        setStates([]);
        toast({
          variant: "destructive",
          title: `Uh oh! We couldn't find any Quotations created ${extraMsg}.`,
        });
      }
    } catch (error) {
      setUnseenQuotes(null);
      setStates([]);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to fetch The Quotations, ${handleError(error)}`,
      });
    }
  };

  const requestSort = (key: QuoteSortKey) => {
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
    fetchAllQuotes(fetchBy);
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
    setCurrentPage(1);
    const { cstName, email, day, month } = fetchBy;
    if (cstName) fetchAllQuotes({ cstName });
    else if (email) fetchAllQuotes({ email });
    else if (day) fetchAllQuotes({ day });
    else if (month) fetchAllQuotes({ month });
  }, [fetchBy]);

  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) pageNumbers.push(i + 1);

  const isSelected = quotesActions.some(
    (selectedQuote) => selectedQuote.checked
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
          { label: "Days", key: QuoteSortKey.DAYS },
          { label: "Hours", key: QuoteSortKey.HOURS },
          { label: "Kids", key: QuoteSortKey.KIDS },
          { label: "Age", key: QuoteSortKey.AGES },
          { label: "Total Hours", key: QuoteSortKey.TOTAL_HOURS },
          { label: "Created At", key: QuoteSortKey.DATE },
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
                { style: "table-cell", label: formatDate(createdAt) },
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
        <UpdateBtn
          updateTarget="Fetch All Quotation"
          handleClick={() => fetchAllQuotes({})}
        />
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-10 w-full">
            <input
              type="text"
              className="fetch-input-style text-style"
              placeholder="Fetch By Client Name"
              value={fetchBy.cstName}
              onChange={(e) =>
                setFetchBy({
                  cstName: e.target.value,
                  email: "",
                  day: null,
                  month: null,
                })
              }
            />
            <input
              type="text"
              className="fetch-input-style text-style"
              placeholder="Fetch By Client Email"
              value={fetchBy.email}
              onChange={(e) =>
                setFetchBy({
                  cstName: "",
                  email: e.target.value,
                  day: null,
                  month: null,
                })
              }
            />
          </div>
          <div className="flex gap-10 justify-center">
            <DatePicker
              selected={fetchBy.day}
              onChange={(date: Date) =>
                setFetchBy({
                  cstName: "",
                  email: "",
                  day: date,
                  month: null,
                })
              }
              dateFormat="dd-MM-yyyy"
              placeholderText="Fetch By Day"
              className="fetch-input-style text-style"
            />
            <DatePicker
              selected={fetchBy.month}
              onChange={(date: Date) =>
                setFetchBy({
                  cstName: "",
                  email: "",
                  day: null,
                  month: date,
                })
              }
              dateFormat="MM-yyyy"
              showMonthYearPicker
              placeholderText="Fetch By Month"
              className="fetch-input-style text-style"
            />
          </div>
        </div>
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

export default QuotesPage;
