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
import { getAllUsers, blockUser } from "@/lib/actions/user.actions";
import { IUser } from "@/lib/database/models/user.model";
import { differenceInDays } from "date-fns";
import { formatDate, sortUsers, handleError, toCap } from "@/lib/utils";
import { UsersSortKey } from "@/constants";
import UpdateBtn from "../btns/UpdateBtn";
import PagePagination from "../helpers/PagePagination";
import DatePicker from "react-datepicker";
import UserDeleteBtn from "../btns/UserDeleteBtn";
import UserCard from "../cards/UserCard";
import "react-datepicker/dist/react-datepicker.css";

type UsersPageProps = {
  setUnseenApplicants: React.Dispatch<React.SetStateAction<number | null>>;
};

type FetchState = {
  applicantName?: string;
  email?: string;
  day?: Date | null;
  month?: Date | null;
};

type usersActionsState = {
  _id: string;
  checked: boolean;
};

const UsersPage: React.FC<UsersPageProps> = ({ setUnseenApplicants }) => {
  const limit = 10;
  const [fetchBy, setFetchBy] = useState<FetchState>({
    applicantName: "",
    email: "",
    day: null,
    month: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState<IUser[] | []>([]);
  const [usersActions, setUsersActions] = useState<usersActionsState[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: UsersSortKey;
    direction: string;
  } | null>(null);

  const { toast } = useToast();

  const today = new Date();

  const setStates = (data: IUser[], allPages: number = 1) => {
    setUsers(data || []);
    setTotalPages(allPages);
    setUsersActions(
      data?.map((user: IUser) => ({
        _id: user._id,
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

  const handleSelectUser = async (userId: string) => {
    // we set the users actions to opposite of the prev state
    setUsersActions((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, checked: !user.checked } : user
      )
    );

    // we check if the user is already in the selected users array
    const isExist = selectedUsers.find((id) => id === userId);

    // if it's exist we remove it from the selected users array else we add it
    setSelectedUsers((prev) =>
      isExist ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
    if (selectAll) setSelectAll(false);
  };

  const handleSelectAll = () => {
    setSelectedUsers(users.map((user) => user._id));
    setUsersActions((prev) =>
      prev.map((user) => ({
        ...user,
        checked: !selectAll,
      }))
    );
    setSelectAll((prev) => !prev);
  };

  const fetchAllUsers = async (fetchBy: FetchState) => {
    const {
      applicantName = "",
      email = "",
      day = null,
      month = null,
    } = fetchBy;

    try {
      const { success, data, totalPages, error } = await getAllUsers({
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
          title: `Uh oh! We couldn't find any Users created ${extraMsg}.`,
        });
      }
    } catch (error) {
      setUnseenApplicants(null);
      setStates([]);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to fetch The Users, ${handleError(error)}`,
      });
    }
  };

  const requestSort = (key: UsersSortKey) => {
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
    fetchAllUsers(fetchBy);
  }, [currentPage]);

  useEffect(() => {
    if (sortConfig) {
      const sortedUsers = sortUsers(
        users,
        sortConfig.key,
        sortConfig.direction
      );
      setUsers(sortedUsers);
      setUsersActions(
        sortedUsers?.map((user: IUser) => ({
          _id: user._id,
          checked: false,
        })) || []
      );
    }
  }, [sortConfig]);

  useEffect(() => {
    setCurrentPage(1);
    const { applicantName, email, day, month } = fetchBy;

    if (applicantName) fetchAllUsers({ applicantName });
    else if (email) fetchAllUsers({ email });
    else if (day) fetchAllUsers({ day });
    else if (month) fetchAllUsers({ month });
  }, [fetchBy]);

  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) pageNumbers.push(i + 1);

  const isSelected = usersActions.some((selectedUser) => selectedUser.checked);

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
          { label: "Gender", key: UsersSortKey.GENDER },
          { label: "DHA", key: UsersSortKey.DHA },
          { label: "CGC", key: UsersSortKey.CGC },
          { label: "Salary", key: UsersSortKey.SALARY },
          {
            label: "Visa Expiry Date",
            key: UsersSortKey.VISA_EXPIRY_DATE,
          },
          { label: "Joining Date", key: UsersSortKey.JOIN_DATE },
          { label: "Joining Days", key: UsersSortKey.DAYS },
          { label: "Created At", key: UsersSortKey.DATE },
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
      {users.map((user, index) => {
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
        } = user;
        const diffInDays = differenceInDays(new Date(joinDate), today);
        const isVisaExpired = isBefore(new Date(visaExpireDate), today);
        const isJoiningExpired = isBefore(new Date(joinDate), today);

        return (
          <React.Fragment key={user._id}>
            <TableRow
              className={`cursor-pointer ${seen ? "" : "text-blue-500"}`}
              onClick={() => handleSelectUser(user._id)}
            >
              <TableCell className="table-cell text-center">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer"
                  checked={usersActions[index].checked}
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
            {usersActions[index].checked && (
              <UserCard
                user={user}
                handleDeleteUser={handleDeleteUser}
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
          handleClick={() => fetchAllUsers({})}
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
          deletionTarget="Delete Selected Users"
          handleClick={handleDeleteSelectedUsers}
        />
      )}
    </div>
  );
};

export default UsersPage;
