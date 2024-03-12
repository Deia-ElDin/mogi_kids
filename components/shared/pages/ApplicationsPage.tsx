"use client";

import React, { useState, useEffect } from "react";
import { format, isBefore } from "date-fns";
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
  getAllApplications,
  deleteApplication,
  deleteSelectedApplications,
  markApplicationAsSeen,
} from "@/lib/actions/career.actions";
import { blockUser } from "@/lib/actions/user.actions";
import { ICareer } from "@/lib/database/models/career.model";
import { differenceInDays } from "date-fns";
import { formatDate, sortApplications, handleError, toCap } from "@/lib/utils";
import { ApplicationsSortKey } from "@/constants";
import UpdateBtn from "../btns/UpdateBtn";
import PagePagination from "../helpers/PagePagination";
import DatePicker from "react-datepicker";
import UserDeleteBtn from "../btns/UserDeleteBtn";
import ApplicationCard from "../cards/ApplicationCard";
import "react-datepicker/dist/react-datepicker.css";

type ApplicationsPageProps = {
  setUnseenApplicants: React.Dispatch<React.SetStateAction<number | null>>;
};

type FetchState = {
  applicantName?: string;
  email?: string;
  day?: Date | null;
  month?: Date | null;
};

type applicationsActionsState = {
  _id: string;
  checked: boolean;
};

const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  setUnseenApplicants,
}) => {
  const limit = 10;
  const [fetchBy, setFetchBy] = useState<FetchState>({
    applicantName: "",
    email: "",
    day: null,
    month: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [applications, setApplications] = useState<ICareer[] | []>([]);
  const [applicationsActions, setApplicationsActions] = useState<
    applicationsActionsState[]
  >([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedApplications, setSelectedApplications] = useState<string[]>(
    []
  );
  const [sortConfig, setSortConfig] = useState<{
    key: ApplicationsSortKey;
    direction: string;
  } | null>(null);

  const { toast } = useToast();

  const today = new Date();

  const setStates = (data: ICareer[], allPages: number = 1) => {
    setApplications(data || []);
    setTotalPages(allPages);
    setApplicationsActions(
      data?.map((application: ICareer) => ({
        _id: application._id,
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

  const handleSelectApplication = async (applicationId: string) => {
    // we set the applications actions to opposite of the prev state
    setApplicationsActions((prev) =>
      prev.map((application) =>
        application._id === applicationId
          ? { ...application, checked: !application.checked }
          : application
      )
    );

    // we check if the application is already in the selected applications array
    const isExist = selectedApplications.find((id) => id === applicationId);

    // if it's exist we remove it from the selected applications array else we add it
    setSelectedApplications((prev) =>
      isExist
        ? prev.filter((id) => id !== applicationId)
        : [...prev, applicationId]
    );

    // we find the selected application from the applications array
    const selected = applications.find(
      (application) => application._id === applicationId
    );

    // if the selected application is not seen we mark it as seen
    if (selected && !selected.seen) {
      const { success, data, error } = await markApplicationAsSeen(
        applicationId
      );

      if (!success && error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Failed to Update The Quotation, ${handleError(error)}`,
        });
      }

      if (data) {
        setApplications(
          applications.map((application) =>
            application._id === applicationId ? data : application
          )
        );
      }
    }
    if (selectAll) setSelectAll(false);
  };

  const handleSelectAll = () => {
    setSelectedApplications(applications.map((application) => application._id));
    setApplicationsActions((prev) =>
      prev.map((application) => ({
        ...application,
        checked: !selectAll,
      }))
    );
    setSelectAll((prev) => !prev);
  };

  const handleDeleteApplication = async (applicationId: string) => {
    try {
      const { success, data, totalPages, error } = await deleteApplication({
        applicationId,
        page: currentPage,
        limit,
      });

      if (!success && error) throw new Error(error);

      if (applications.length === selectedApplications.length) {
        setStates([]);
      } else {
        const { applicantName, email, day, month } = fetchBy;
        if (applicantName || email || day || month) {
          const newApplications = applications.filter(
            (application) => application._id !== applicationId
          );
          setStates(newApplications);
        } else if (data) setStates(data, totalPages);
      }

      setApplications((prevApplications) =>
        prevApplications.filter(
          (application) => application._id !== applicationId
        )
      );
      setApplicationsActions((prevApplicationsActions) =>
        prevApplicationsActions.filter(
          (application) => application._id !== applicationId
        )
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

  const handleDeleteSelectedApplications = async () => {
    try {
      const { success, data, totalPages, error } =
        await deleteSelectedApplications({
          selectedApplications,
          page: currentPage,
        });

      if (!success && error) throw new Error(error);
      toast({ description: "Quotation Selection Deleted Successfully." });

      if (applications.length === selectedApplications.length) {
        setStates([]);
      } else {
        const { applicantName, email, day, month } = fetchBy;
        if (applicantName || email || day || month) {
          const newApplications = applications.filter(
            (application) => !selectedApplications.includes(application._id)
          );
          setStates(newApplications);
        } else if (data) setStates(data, totalPages);
      }
      setSelectedApplications([]);
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

  const fetchAllApplications = async (fetchBy: FetchState) => {
    const {
      applicantName = "",
      email = "",
      day = null,
      month = null,
    } = fetchBy;

    try {
      const { success, data, totalPages, unseen, error } =
        await getAllApplications({
          fetch: fetchBy,
          limit,
          page: currentPage,
        });

      if (!success && error) throw new Error(error);
      if (unseen) setUnseenApplicants(unseen);
      if (success && data && data?.length > 0) setStates(data, totalPages);
      else {
        setUnseenApplicants(null);
        let extraMsg = "yet in the Database.";
        if (applicantName) extraMsg = `by ${applicantName}.`;
        else if (email) extraMsg = `by ${email}.`;
        else if (day) extraMsg = `at ${format(day, "EEE, dd/MM/yyyy")}.`;
        else if (month) extraMsg = `during ${format(month, "MMMM MM/yyyy")}.`;
        setStates([]);
        toast({
          variant: "destructive",
          title: `Uh oh! We couldn't find any Applications created ${extraMsg}.`,
        });
      }
    } catch (error) {
      setUnseenApplicants(null);
      setStates([]);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to fetch The Applications, ${handleError(error)}`,
      });
    }
  };

  const requestSort = (key: ApplicationsSortKey) => {
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
    fetchAllApplications(fetchBy);
  }, [currentPage]);

  useEffect(() => {
    if (sortConfig) {
      const sortedApplications = sortApplications(
        applications,
        sortConfig.key,
        sortConfig.direction
      );
      setApplications(sortedApplications);
      setApplicationsActions(
        sortedApplications?.map((application: ICareer) => ({
          _id: application._id,
          checked: false,
        })) || []
      );
    }
  }, [sortConfig]);

  useEffect(() => {
    setCurrentPage(1);
    const { applicantName, email, day, month } = fetchBy;

    if (applicantName) fetchAllApplications({ applicantName });
    else if (email) fetchAllApplications({ email });
    else if (day) fetchAllApplications({ day });
    else if (month) fetchAllApplications({ month });
  }, [fetchBy]);

  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) pageNumbers.push(i + 1);

  const isSelected = applicationsActions.some(
    (selectedApplication) => selectedApplication.checked
  );

  const TrueImage = ({ condition }: { condition: boolean }) => (
    <img
      src={`/assets/icons/${condition ? "true" : "false"}.svg`}
      alt="True/false icon"
      height={20}
      width={20}
      className="m-auto"
    />
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
        <TableHead className="table-head">Applicant</TableHead>
        {[
          { label: "Gender", key: ApplicationsSortKey.GENDER },
          { label: "DHA", key: ApplicationsSortKey.DHA },
          { label: "CGC", key: ApplicationsSortKey.CGC },
          { label: "Salary", key: ApplicationsSortKey.SALARY },
          {
            label: "Visa Expiry Date",
            key: ApplicationsSortKey.VISA_EXPIRY_DATE,
          },
          { label: "Joining Date", key: ApplicationsSortKey.JOIN_DATE },
          { label: "Joining Days", key: ApplicationsSortKey.DAYS },
          { label: "Created At", key: ApplicationsSortKey.DATE },
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
      {applications.map((application, index) => {
        const {
          fullName,
          expectedSalary,
          joinDate,
          gender,
          dhaCertificate,
          careGiverCertificate,
          visaExpireDate,
          imgUrl,
          seen,
          createdAt,
        } = application;
        const diffInDays = differenceInDays(new Date(joinDate), today);
        const isVisaExpired = isBefore(new Date(visaExpireDate), today);
        const isJoiningExpired = isBefore(new Date(joinDate), today);

        return (
          <React.Fragment key={application._id}>
            <TableRow
              className={`cursor-pointer ${seen ? "" : "text-blue-500"}`}
              onClick={() => handleSelectApplication(application._id)}
            >
              <TableCell className="table-cell text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer"
                  checked={applicationsActions[index].checked}
                  onChange={(e) => e.stopPropagation()}
                />
              </TableCell>
              <TableCell className="table-cell">
                {toCap(fullName.split(" ")[0])}
              </TableCell>
              <TableCell
                className={`table-cell ${
                  gender.toLowerCase() === "female" ? "" : "text-red-500"
                }`}
              >
                {toCap(gender)}
              </TableCell>
              <TableCell className="table-cell">
                <TrueImage condition={dhaCertificate.toLowerCase() === "yes"} />
              </TableCell>
              <TableCell className="table-cell">
                <TrueImage
                  condition={careGiverCertificate.toLowerCase() === "yes"}
                />
              </TableCell>
              <TableCell className="table-cell">{expectedSalary}</TableCell>
              <TableCell
                className={`table-cell ${isVisaExpired ? "text-red-500" : ""}`}
              >
                {formatDate(String(visaExpireDate))}
              </TableCell>
              <TableCell
                className={`table-cell ${
                  isJoiningExpired ? "text-red-500" : ""
                }`}
              >
                {formatDate(String(joinDate))}
              </TableCell>
              <TableCell
                className={`table-cell ${diffInDays > 0 ? "" : "text-red-500"}`}
              >
                {diffInDays > 0 ? diffInDays : diffInDays}
              </TableCell>

              <TableCell className="table-cell">
                {formatDate(String(createdAt))}
              </TableCell>
            </TableRow>
            {applicationsActions[index].checked && (
              <ApplicationCard
                application={application}
                handleDeleteApplication={handleDeleteApplication}
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
          updateTarget="Fetch All Applications"
          handleClick={() => fetchAllApplications({})}
        />
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-10 w-full">
            <input
              type="text"
              className="fetch-input-style text-style"
              placeholder="Fetch By Client Name"
              value={fetchBy.applicantName}
              onChange={(e) =>
                setFetchBy({
                  applicantName: e.target.value,
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
                  applicantName: "",
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
                  applicantName: "",
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
                  applicantName: "",
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
          deletionTarget="Delete Selected Applications"
          handleClick={handleDeleteSelectedApplications}
        />
      )}
    </div>
  );
};

export default ApplicationsPage;
