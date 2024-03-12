"use client";

import React, { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { getAllUsers, updateUser } from "@/lib/actions/user.actions";
import { IUser } from "@/lib/database/models/user.model";
import { formatDate, handleError, toCap } from "@/lib/utils";
import UpdateBtn from "../btns/UpdateBtn";
import PagePagination from "../helpers/PagePagination";
import DatePicker from "react-datepicker";
import UserCard from "../cards/UserCard";
import Image from "next/image";
import "react-datepicker/dist/react-datepicker.css";

type FetchState = {
  firstName?: string;
  email?: string;
  day?: Date | null;
  month?: Date | null;
};

type usersActionsState = {
  _id: string;
  checked: boolean;
};

const UsersPage: React.FC = () => {
  const limit = 10;
  const [fetchBy, setFetchBy] = useState<FetchState>({
    firstName: "",
    email: "",
    day: null,
    month: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState<IUser[] | []>([]);
  const [usersActions, setUsersActions] = useState<usersActionsState[]>([]);

  const { toast } = useToast();

  const pathname = usePathname();

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

  const handleUpdateUser = async (userId: string, role: string) => {
    try {
      const { success, data, error } = await updateUser({ userId, role });
      if (!success && error) throw new Error(error);
      if (data) {
        setUsers((prev) =>
          prev.map((user) => (user._id === userId ? data : user))
        );
      }

      toast({ description: "User Updated Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Update The User, ${handleError(error)}`,
      });
    }
  };

  const fetchAllUsers = async (fetchBy: FetchState) => {
    const { firstName = "", email = "", day = null, month = null } = fetchBy;

    try {
      const { success, data, totalPages, error } = await getAllUsers({
        fetch: fetchBy,
        limit,
        page: currentPage,
      });

      if (!success && error) throw new Error(error);
      if (success && data && data?.length > 0) setStates(data, totalPages);
      else {
        let extraMsg = "created yet in the Database.";
        if (firstName) extraMsg = `his first name matches ${firstName}.`;
        else if (email) extraMsg = `his email name  ${email}.`;
        else if (day)
          extraMsg = `created at ${format(day, "EEE, dd/MM/yyyy")}.`;
        else if (month)
          extraMsg = `created during ${format(month, "MMMM MM/yyyy")}.`;
        setStates([]);
        toast({
          variant: "destructive",
          title: `Uh oh! We couldn't find any Users ${extraMsg}.`,
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

  useEffect(() => {
    fetchAllUsers(fetchBy);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    const { firstName, email, day, month } = fetchBy;

    if (firstName) fetchAllUsers({ firstName });
    else if (email) fetchAllUsers({ email });
    else if (day) fetchAllUsers({ day });
    else if (month) fetchAllUsers({ month });
  }, [fetchBy]);

  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) pageNumbers.push(i + 1);

  const TableHeaderComp = () => (
    <TableHeader>
      <TableRow>
        {[
          "Photo",
          "First Name",
          "Last Name",
          "Email",
          "Admin",
          "Created At",
        ].map((item) => (
          <TableHead key={item} className="table-head">
            {item}
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
          photo,
          firstName,
          lastName,
          email,
          role,
          blocked,
          createdAt,
        } = user;
        const isAdmin = role === "Admin" || role === "Manager";
        return (
          <React.Fragment key={user._id}>
            <TableRow
              className={`cursor-pointer ${
                isAdmin
                  ? "text-green-500 font-bold"
                  : blocked
                  ? "text-red-500"
                  : ""
              }`}
              onClick={() =>
                setUsersActions((prev) =>
                  prev.map((user) =>
                    user._id === _id
                      ? { ...user, checked: !user.checked }
                      : user
                  )
                )
              }
            >
              <TableCell>
                <Image
                  src={photo || "/assets/icons/default-user.svg"}
                  alt="User photo"
                  height={40}
                  width={40}
                  className="rounded-full m-auto"
                />
              </TableCell>
              <TableCell className="table-cell">
                {firstName ? toCap(firstName) : ""}
              </TableCell>
              <TableCell className="table-cell">
                {lastName ? toCap(lastName) : ""}
              </TableCell>
              <TableCell className="table-cell">{email}</TableCell>
              <TableCell className="table-cell">
                <Switch
                  className="data-[state=checked]:bg-green-500"
                  checked={role === "Admin"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateUser(
                      user._id,
                      role === "Admin" ? "User" : "Admin"
                    );
                  }}
                />
              </TableCell>
              <TableCell className="table-cell">
                {formatDate(String(createdAt))}
              </TableCell>
            </TableRow>
            {usersActions[index].checked && (
              <UserCard user={user} setUsers={setUsers} />
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
          updateTarget="Fetch All Users"
          handleClick={() => fetchAllUsers({})}
        />
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-10 w-full">
            <input
              type="text"
              className="fetch-input-style text-style"
              placeholder="Fetch By User First Name"
              value={fetchBy.firstName}
              onChange={(e) =>
                setFetchBy({
                  firstName: e.target.value,
                  email: "",
                  day: null,
                  month: null,
                })
              }
            />
            <input
              type="text"
              className="fetch-input-style text-style"
              placeholder="Fetch By User Email"
              value={fetchBy.email}
              onChange={(e) =>
                setFetchBy({
                  firstName: "",
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
                  firstName: "",
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
                  firstName: "",
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
    </div>
  );
};

export default UsersPage;
