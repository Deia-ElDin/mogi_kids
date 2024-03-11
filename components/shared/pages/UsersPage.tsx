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
  getAllUsers,
  getDayUsers,
  getMonthUsers,
  getCstNameUsers,
  deleteUser,
  deleteSelectedUsers,
  markUserAsSeen,
  countUnseenUsers,
} from "@/lib/actions/user.actions";
import { blockUser } from "@/lib/actions/user.actions";
import { IUser } from "@/lib/database/models/user.model";
import { differenceInDays } from "date-fns";
import { formatDate, sortUsers, handleError } from "@/lib/utils";
import { QuoteSortKey } from "@/constants";
import Image from "next/image";
import UpdateBtn from "../btns/UpdateBtn";
import PagePagination from "../helpers/PagePagination";
import DatePicker from "react-datepicker";
import UserDeleteBtn from "../btns/UserDeleteBtn";
import UserCard from "../cards/UserCard";
import "react-datepicker/dist/react-datepicker.css";

const UsersPage: React.FC = () => {
  const limit = 10;
  const [fetchByUsername, setFetchByUsername] = useState<string>("");
  const [fetchByEmail, setFetchByEmail] = useState<string>("");
  const [fetchByDay, setFetchByDay] = useState<Date | null>(null);
  const [fetchByMonth, setFetchByMonth] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState<IUser[] | []>([]);
  const [usersActions, setUsersActions] = useState<
    { _id: string; checked: boolean }[]
  >([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: QuoteSortKey;
    direction: string;
  } | null>(null);

  const { toast } = useToast();

  console.log("users", users);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFetchByUsername(e.target.value);
    if (fetchByDay) setFetchByDay(null);
    if (fetchByMonth) setFetchByMonth(null);
  };

  const handleDayChange = (date: Date | null) => {
    setFetchByDay(date);
    if (fetchByUsername) setFetchByUsername("");
    if (fetchByMonth) setFetchByMonth(null);
  };

  const handleMonthChange = (date: Date | null) => {
    setFetchByMonth(date);
    if (fetchByUsername) setFetchByUsername("");
    if (fetchByDay) setFetchByDay(null);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { success, error } = await deleteUser(userId);
      if (!success && error) throw new Error(error);
      if (fetchByUsername) setFetchByUsername("");
      if (fetchByDay) setFetchByDay(null);
      if (fetchByMonth) setFetchByMonth(null);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      setUsersActions((prevUsersActions) =>
        prevUsersActions.filter((user) => user._id !== userId)
      );
      toast({ description: "User Deleted Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete The User, ${handleError(error)}`,
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

  const handleSelectUser = async (userId: string) => {
    setUsersActions((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, checked: !user.checked } : user
      )
    );
    const isExist = selectedUsers.find((id) => id === userId);
    setSelectedUsers((prev) =>
      isExist ? prev.filter((id) => id !== userId) : [...prev, userId]
    );

    const selected = users.find((user) => user._id === userId);

    if (selected && !selected.seen) {
      const { success, data, error } = await markUserAsSeen(userId);
      console.log("data", data);

      if (!success && error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Failed to Update The User, ${handleError(error)}`,
        });
      }

      if (data) {
        setUsers(users.map((user) => (user._id === userId ? data : user)));
      }

      fetchUnseenUsersNumber();
    }
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

  const handleDeleteSelectedUsers = async () => {
    try {
      const { success, error } = await deleteSelectedUsers(selectedUsers);
      if (!success && error) throw new Error(error);
      toast({ description: "User Selection Deleted Successfully." });

      if (users.length === selectedUsers.length) {
        setStates([]);
      } else {
        const newUsers = users.filter(
          (user) => !selectedUsers.includes(user._id)
        );
        setStates(newUsers);
      }
      setSelectedUsers([]);
      setSelectAll(false);
      if (fetchByUsername) setFetchByUsername("");
      if (fetchByDay) setFetchByDay(null);
      if (fetchByMonth) setFetchByMonth(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete The User Selection, ${handleError(
          error
        )}`,
      });
    }
  };

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

  const fetchUnseenUsersNumber = async () => {
    try {
      const { success, data, error } = await countUnseenUsers();
      if (!success && error) throw new Error(error);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${handleError(error)}`,
      });
    }
  };

  const fetchAllUsers = async () => {
    if (fetchByUsername) setFetchByUsername("");
    if (fetchByDay) setFetchByDay(null);
    if (fetchByMonth) setFetchByMonth(null);

    try {
      const { success, data, totalPages, error } = await getAllUsers({
        limit,
        page: currentPage,
      });

      if (!success && error) throw new Error(error);
      if (success && data) setStates(data, totalPages);
      else {
        setStates([]);
        toast({
          variant: "destructive",
          title: "Uh oh! We couldn't find any Users yet in the Database.",
        });
      }
    } catch (error) {
      setStates([]);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to fetch The Users, ${handleError(error)}`,
      });
    }
  };

  const fetchUsersByCstName = async (cstName: string) => {
    try {
      const { success, data, error } = await getCstNameUsers(cstName);

      if (!success && error) throw new Error(error);
      if (success && data) setStates(data);
      else {
        setStates([]);
        toast({
          variant: "destructive",
          title: `Uh oh! We couldn't find any Users created by ${cstName}.`,
        });
      }
    } catch (error) {
      setStates([]);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to fetch The Users, ${handleError(error)}`,
      });
    }
  };

  const fetchUsersByDay = async (day: Date) => {
    try {
      const { success, data, error } = await getDayUsers(day);

      if (!success && error) throw new Error(error);
      if (success && data) setStates(data);
      else {
        setStates([]);
        toast({
          variant: "destructive",
          title: `Uh oh! We couldn't find any Users create at ${format(
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
        description: `Failed to fetch The Users, ${handleError(error)}`,
      });
    }
  };

  const fetchUsersByMonth = async (month: Date) => {
    try {
      const { success, data, error } = await getMonthUsers(month);

      if (!success && error) throw new Error(error);
      if (success && data) setStates(data);
      else {
        setStates([]);
        toast({
          variant: "destructive",
          title: `Uh oh! We couldn't find any Users create during this ${format(
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
        description: `Failed to fetch The Users, ${handleError(error)}`,
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
    fetchAllUsers();
    fetchUnseenUsersNumber();
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
    if (fetchByUsername) fetchUsersByCstName(fetchByUsername);
    else if (fetchByDay) fetchUsersByDay(fetchByDay);
    else if (fetchByMonth) fetchUsersByMonth(fetchByMonth);
  }, [fetchByUsername, fetchByDay, fetchByMonth]);

  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) pageNumbers.push(i + 1);

  const isSelected = usersActions.some((selectedUser) => selectedUser.checked);

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
        {[
          { label: "Image", key: QuoteSortKey.DAYS },
          { label: "First Name", key: QuoteSortKey.HOURS },
          { label: "Last Name", key: QuoteSortKey.KIDS },
          { label: "Email", key: QuoteSortKey.AGES },
          { label: "Reviews", key: QuoteSortKey.TOTAL_HOURS },
          { label: "Role", key: QuoteSortKey.DATE },
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
      {users.map((user, index) => {
        const {
          _id,
          firstName,
          lastName,
          email,
          photo,
          role,
          reviews,
          createdAt,
        } = user;

        return (
          <React.Fragment key={_id}>
            <TableRow
              className="cursor-pointer"
              onClick={() => handleSelectUser(_id)}
            >
              <TableCell className="table-cell text-center ">
                <input
                  type="checkbox"
                  className="h-[18px] w-[18px] cursor-pointer"
                  checked={usersActions[index].checked}
                  onChange={(e) => e.stopPropagation()}
                />
              </TableCell>
              <TableCell className="table-head flex justify-center items-center">
                <Image
                  src={photo}
                  alt={`${firstName} photo`}
                  width={35}
                  height={35}
                  className="rounded-full"
                />
              </TableCell>
              {[
                { style: "table-cell", label: firstName },
                { style: "table-cell", label: lastName },
                { style: "table-cell", label: email },
                { style: "table-cell", label: reviews.length },
                { style: "table-cell", label: role },
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
        <UpdateBtn updateTarget="Fetch All User" handleClick={fetchAllUsers} />
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-10 w-full">
            <input
              type="text"
              className="fetch-input-style text-style flex-1"
              placeholder="Fetch By Client Name"
              value={fetchByUsername}
              onChange={(e) => handleUsernameChange(e)}
            />
            <input
              type="text"
              className="fetch-input-style text-style flex-1"
              placeholder="Fetch By Client Email"
              value={fetchByUsername}
              onChange={(e) => handleUsernameChange(e)}
            />
          </div>
          <div className="flex gap-10 justify-center">
            <DatePicker
              selected={fetchByMonth}
              onChange={handleMonthChange}
              dateFormat="MM-yyyy"
              showMonthYearPicker
              placeholderText="Fetch By Month"
              className="fetch-input-style text-style"
            />
            <DatePicker
              selected={fetchByDay}
              onChange={handleDayChange}
              dateFormat="dd-MM-yyyy"
              placeholderText="Fetch By Day"
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
