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
  getAllReports,
  deleteReport,
  deleteSelectedReports,
  markReportAsSeen,
} from "@/lib/actions/report.actions";
import { IUser } from "@/lib/database/models/user.model";
import { IReport } from "@/lib/database/models/report.model";
import { formatDate, handleError, toCap } from "@/lib/utils";
import UpdateBtn from "../btns/UpdateBtn";
import PagePagination from "../helpers/PagePagination";
import DatePicker from "react-datepicker";
import UserDeleteBtn from "../btns/UserDeleteBtn";
import ReportCard from "../cards/ReportCard";
import "react-datepicker/dist/react-datepicker.css";

type ReportsPageProps = {
  setUnseenReports: React.Dispatch<React.SetStateAction<number | null>>;
};

type FetchState = {
  day?: Date | null;
  month?: Date | null;
};

type reportsActionsState = {
  _id: string;
  checked: boolean;
};

const ReportsPage: React.FC<ReportsPageProps> = ({ setUnseenReports }) => {
  const limit = 10;
  const [fetchBy, setFetchBy] = useState<FetchState>({
    day: null,
    month: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reports, setReports] = useState<IReport[] | []>([]);
  const [reportsActions, setReportsActions] = useState<reportsActionsState[]>(
    []
  );
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  console.log("reports", reports);

  const { toast } = useToast();

  const setStates = (data: IReport[], allPages: number = 1) => {
    setReports(data || []);
    setTotalPages(allPages);
    setReportsActions(
      data?.map((report: IReport) => ({
        _id: report._id,
        checked: false,
      })) || []
    );
  };

  const handleSelectReport = async (reportId: string) => {
    // we set the reports actions to opposite of the prev state
    setReportsActions((prev) =>
      prev.map((report) =>
        report._id === reportId
          ? { ...report, checked: !report.checked }
          : report
      )
    );

    // we check if the report is already in the selected reports array
    const isExist = selectedReports.find((id) => id === reportId);

    // if it's exist we remove it from the selected reports array else we add it
    setSelectedReports((prev) =>
      isExist ? prev.filter((id) => id !== reportId) : [...prev, reportId]
    );

    // we find the selected report from the reports array
    const selected = reports.find((report) => report._id === reportId);

    // if the selected report is not seen we mark it as seen
    if (selected && !selected.seen) {
      const { success, data, error } = await markReportAsSeen(reportId);

      if (!success && error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Failed to Update The Report, ${handleError(error)}`,
        });
      }

      if (data) {
        setReports(
          reports.map((report) => (report._id === reportId ? data : report))
        );
      }
    }
    if (selectAll) setSelectAll(false);
  };

  const handleSelectAll = () => {
    setSelectedReports(reports.map((report) => report._id));
    setReportsActions((prev) =>
      prev.map((report) => ({
        ...report,
        checked: !selectAll,
      }))
    );
    setSelectAll((prev) => !prev);
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      const { success, data, totalPages, error } = await deleteReport({
        reportId,
        page: currentPage,
        limit,
      });

      if (!success && error) throw new Error(error);

      if (reports.length === selectedReports.length) {
        setStates([]);
      } else {
        const { day, month } = fetchBy;
        if (day || month) {
          const newReports = reports.filter(
            (report) => report._id !== reportId
          );
          setStates(newReports);
        } else if (data) setStates(data, totalPages);
      }

      setReports((prevReports) =>
        prevReports.filter((report) => report._id !== reportId)
      );
      setReportsActions((prevReportsActions) =>
        prevReportsActions.filter((report) => report._id !== reportId)
      );
      toast({ description: "Report Deleted Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete The Report, ${handleError(error)}`,
      });
    }
  };

  const handleDeleteSelectedReports = async () => {
    try {
      const { success, data, totalPages, error } = await deleteSelectedReports({
        selectedReports,
        page: currentPage,
      });

      if (!success && error) throw new Error(error);
      toast({ description: "Report Selection Deleted Successfully." });

      if (reports.length === selectedReports.length) {
        setStates([]);
      } else {
        const { day, month } = fetchBy;
        if (day || month) {
          const newReports = reports.filter(
            (report) => !selectedReports.includes(report._id)
          );
          setStates(newReports);
        } else if (data) setStates(data, totalPages);
      }
      setSelectedReports([]);
      setSelectAll(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete The Report Selection, ${handleError(
          error
        )}`,
      });
    }
  };

  const fetchAllReports = async (fetchBy: FetchState) => {
    const { day, month } = fetchBy;

    try {
      const { success, data, totalPages, unseen, error } = await getAllReports({
        fetch: fetchBy,
        limit,
        page: currentPage,
      });

      if (!success && error) throw new Error(error);
      if (unseen) setUnseenReports(unseen);
      if (success && data && data?.length > 0) setStates(data, totalPages);
      else {
        setUnseenReports(null);
        let extraMsg = "in the Database.";
        if (day) extraMsg = `at ${format(day, "EEE, dd/MM/yyyy")}.`;
        else if (month) extraMsg = `during ${format(month, "MMMM MM/yyyy")}.`;
        setStates([]);
        toast({
          variant: "destructive",
          title: `Uh oh! We couldn't find any Reports ${extraMsg}.`,
        });
      }
    } catch (error) {
      setUnseenReports(null);
      setStates([]);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to fetch The Reports, ${handleError(error)}`,
      });
    }
  };

  useEffect(() => {
    fetchAllReports(fetchBy);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    const { day, month } = fetchBy;

    if (day) fetchAllReports({ day });
    else if (month) fetchAllReports({ month });
  }, [fetchBy]);

  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) pageNumbers.push(i + 1);

  const isSelected = reportsActions.some(
    (selectedReport) => selectedReport.checked
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
        {["Report Type", "Created By", "Created At"].map((item) => (
          <TableHead key={item} className="table-head">
            {item}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );

  const TableBodyComp = () => (
    <TableBody>
      {reports.map((report, index) => {
        console.log("TableBodyComp report", report);

        const { createdBy, target, targetId, seen, createdAt } = report;
        const firstName =
          createdBy && typeof createdBy === "object" && "firstName" in createdBy
            ? (createdBy as IUser).firstName
            : "Unknown";

        return (
          <React.Fragment key={report._id}>
            <TableRow
              className={`cursor-pointer ${seen ? "" : "text-blue-500"}`}
              onClick={() => handleSelectReport(report._id)}
            >
              <TableCell className="table-cell text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer"
                  checked={reportsActions[index].checked}
                  onChange={(e) => e.stopPropagation()}
                />
              </TableCell>
              <TableCell className="table-cell">{target}</TableCell>
              <TableCell className="table-cell">{toCap(firstName)}</TableCell>
              <TableCell className="table-cell">
                {formatDate(String(createdAt))}
              </TableCell>
            </TableRow>
            {reportsActions[index].checked && (
              <ReportCard
                target={target}
                targetId={targetId.toString()}
                fetchAllReports={fetchAllReports}
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
          updateTarget="Fetch All Reports"
          handleClick={() => fetchAllReports(fetchBy)}
        />
        <div className="flex justify-center gap-1 w-full">
          <DatePicker
            selected={fetchBy.day}
            onChange={(date: Date) => setFetchBy({ day: date, month: null })}
            dateFormat="dd-MM-yyyy"
            placeholderText="Fetch By Day"
            className="fetch-input-style text-style ml-auto"
          />
          <DatePicker
            selected={fetchBy.month}
            onChange={(date: Date) => setFetchBy({ day: null, month: date })}
            dateFormat="MM-yyyy"
            showMonthYearPicker
            placeholderText="Fetch By Month"
            className="fetch-input-style text-style"
          />
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
          deletionTarget="Delete Selected Reports"
          handleClick={handleDeleteSelectedReports}
        />
      )}
    </div>
  );
};

export default ReportsPage;
