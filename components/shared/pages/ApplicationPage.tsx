// "use client";

// import React, { useState, useEffect } from "react";
// import { format } from "date-fns";
// import { useToast } from "@/components/ui/use-toast";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   getAllApplications,
//   getDayApplications,
//   getMonthApplications,
//   getApplicationByName,
//   deleteApplication,
//   deleteSelectedApplications,
//   markApplicationAsSeen,
//   countUnseenApplications,
// } from "@/lib/actions/application.actions";
// import { blockUser } from "@/lib/actions/user.actions";
// import { IApplication } from "@/lib/database/models/application.model";
// import { differenceInDays } from "date-fns";
// import { formatMongoDbDate, handleError } from "@/lib/utils";
// import UpdateBtn from "../btns/UpdateBtn";
// import PagePagination from "../helpers/PagePagination";
// import DatePicker from "react-datepicker";
// import UserDeleteBtn from "../btns/UserDeleteBtn";
// import ApplicationCard from "../cards/ApplicationCard";
// import "react-datepicker/dist/react-datepicker.css";

// type ApplicationProps = {
//   setUnseenApplicants: React.Dispatch<React.SetStateAction<number | null>>;
// };

// const Application: React.FC<ApplicationProps> = ({ setUnseenApplicants }) => {
//   const limit = 10;
//   const [fetchByApplicantName, setFetchByApplicantName] = useState<string>("");
//   const [fetchByDay, setFetchByDay] = useState<Date | null>(null);
//   const [fetchByMonth, setFetchByMonth] = useState<Date | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [applications, setApplications] = useState<IApplication[] | []>([]);
//   const [applicationsActions, setApplicationsActions] = useState<
//     { _id: string; checked: boolean }[]
//   >([]);
//   const [selectAll, setSelectAll] = useState<boolean>(false);
//   const [selectedApplications, setSelectedApplications] = useState<string[]>(
//     []
//   );

//   console.log("applications", applications);

//   const { toast } = useToast();

//   const handleApplicantNameChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setFetchByApplicantName(e.target.value);
//     if (fetchByDay) setFetchByDay(null);
//     if (fetchByMonth) setFetchByMonth(null);
//   };

//   const handleDayChange = (date: Date | null) => {
//     setFetchByDay(date);
//     if (fetchByApplicantName) setFetchByApplicantName("");
//     if (fetchByMonth) setFetchByMonth(null);
//   };

//   const handleMonthChange = (date: Date | null) => {
//     setFetchByMonth(date);
//     if (fetchByApplicantName) setFetchByApplicantName("");
//     if (fetchByDay) setFetchByDay(null);
//   };

//   const handleDeleteApplication = async (applicationId: string) => {
//     try {
//       const { success, error } = await deleteApplication(applicationId);
//       if (!success && error) throw new Error(error);
//       toast({ description: "Application Deleted Successfully." });
//       if (fetchByApplicantName) setFetchByApplicantName("");
//       if (fetchByDay) setFetchByDay(null);
//       if (fetchByMonth) setFetchByMonth(null);
//       setApplications((prevApplications) =>
//         prevApplications.filter(
//           (application) => application._id !== applicationId
//         )
//       );
//       setApplicationsActions((prevApplicationsActions) =>
//         prevApplicationsActions.filter(
//           (application) => application._id !== applicationId
//         )
//       );
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Uh oh! Something went wrong.",
//         description: `Failed to Delete The Application, ${handleError(error)}`,
//       });
//     }
//   };

//   const handleBlockUser = async (userId: string) => {
//     try {
//       const { success, error } = await blockUser(userId);
//       if (!success && error) throw new Error(error);
//       toast({ description: "User Blocked Successfully." });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Uh oh! Something went wrong.",
//         description: `Failed to Block The User, ${handleError(error)}`,
//       });
//     }
//   };

//   const handleSelectApplication = async (applicationId: string) => {
//     setApplicationsActions((prev) =>
//       prev.map((application) =>
//         application._id === applicationId
//           ? { ...application, checked: !application.checked }
//           : application
//       )
//     );
//     const isExist = selectedApplications.find((id) => id === applicationId);
//     setSelectedApplications((prev) =>
//       isExist
//         ? prev.filter((id) => id !== applicationId)
//         : [...prev, applicationId]
//     );

//     const selected = applications.find(
//       (application) => application._id === applicationId
//     );

//     if (selected && !selected.seen) {
//       const { success, data, error } = await markApplicationAsSeen(
//         applicationId
//       );
//       console.log("data", data);

//       if (!success && error) {
//         toast({
//           variant: "destructive",
//           title: "Uh oh! Something went wrong.",
//           description: `Failed to Update The Application, ${handleError(
//             error
//           )}`,
//         });
//       }

//       if (data) {
//         setApplications(
//           applications.map((application) =>
//             application._id === applicationId ? data : application
//           )
//         );
//       }

//       fetchUnseenApplicationsNumber();
//     }
//   };

//   const handleSelectAll = () => {
//     setSelectedApplications(applications.map((application) => application._id));
//     setApplicationsActions((prev) =>
//       prev.map((application) => ({
//         ...application,
//         checked: !selectAll,
//       }))
//     );
//     setSelectAll((prev) => !prev);
//   };

//   const handleDeleteSelectedApplications = async () => {
//     try {
//       const { success, error } = await deleteSelectedApplications(
//         selectedApplications
//       );
//       if (!success && error) throw new Error(error);
//       toast({ description: "Application Selection Deleted Successfully." });

//       if (applications.length === selectedApplications.length) {
//         setStates([]);
//       } else {
//         const newApplications = applications.filter(
//           (application) => !selectedApplications.includes(application._id)
//         );
//         setStates(newApplications);
//       }
//       setSelectedApplications([]);
//       setSelectAll(false);
//       if (fetchByApplicantName) setFetchByApplicantName("");
//       if (fetchByDay) setFetchByDay(null);
//       if (fetchByMonth) setFetchByMonth(null);
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Uh oh! Something went wrong.",
//         description: `Failed to Delete The Application Selection, ${handleError(
//           error
//         )}`,
//       });
//     }
//   };

//   const setStates = (data: IApplication[], allPages: number = 1) => {
//     setApplications(data || []);
//     setTotalPages(allPages);
//     setApplicationsActions(
//       data?.map((application: IApplication) => ({
//         _id: application._id,
//         checked: false,
//       })) || []
//     );
//   };

//   const fetchUnseenApplicationsNumber = async () => {
//     try {
//       const { success, data, error } = await countUnseenApplications();
//       if (!success && error) throw new Error(error);
//       if (data) setUnseenApplicants(data);
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Uh oh! Something went wrong.",
//         description: `${handleError(error)}`,
//       });
//     }
//   };

//   const fetchAllApplications = async () => {
//     if (fetchByApplicantName) setFetchByApplicantName("");
//     if (fetchByDay) setFetchByDay(null);
//     if (fetchByMonth) setFetchByMonth(null);

//     try {
//       const { success, data, totalPages, error } = await getAllApplications({
//         limit,
//         page: currentPage,
//       });

//       console.log("data", data, "totalPages", totalPages);

//       if (!success && error) throw new Error(error);
//       if (success && data) setStates(data, totalPages);
//       else {
//         setStates([]);
//         toast({
//           variant: "destructive",
//           title:
//             "Uh oh! We couldn't find any Applications yet in the Database.",
//         });
//       }
//     } catch (error) {
//       setStates([]);
//       toast({
//         variant: "destructive",
//         title: "Uh oh! Something went wrong.",
//         description: `Failed to fetch The Applications, ${handleError(error)}`,
//       });
//     }
//   };

//   const fetchCstNameQuests = async (cstName: string) => {
//     try {
//       const { success, data, error } = await getApplicationByName(cstName);

//       if (!success && error) throw new Error(error);
//       if (success && data) setStates(data);
//       else {
//         setStates([]);
//         toast({
//           variant: "destructive",
//           title: `Uh oh! We couldn't find any Applications created by ${cstName}.`,
//         });
//       }
//     } catch (error) {
//       setStates([]);
//       toast({
//         variant: "destructive",
//         title: "Uh oh! Something went wrong.",
//         description: `Failed to fetch The Applications, ${handleError(error)}`,
//       });
//     }
//   };

//   const fetchDayApplications = async (day: Date) => {
//     try {
//       const { success, data, error } = await getDayApplications(day);

//       if (!success && error) throw new Error(error);
//       if (success && data) setStates(data);
//       else {
//         setStates([]);
//         toast({
//           variant: "destructive",
//           title: `Uh oh! We couldn't find any Applications create at ${format(
//             day,
//             "EEE, dd/MM/yyyy"
//           )}.`,
//         });
//       }
//     } catch (error) {
//       setStates([]);
//       toast({
//         variant: "destructive",
//         title: "Uh oh! Something went wrong.",
//         description: `Failed to fetch The Applications, ${handleError(error)}`,
//       });
//     }
//   };

//   const fetchMonthApplications = async (month: Date) => {
//     try {
//       const { success, data, error } = await getMonthApplications(month);

//       if (!success && error) throw new Error(error);
//       if (success && data) setStates(data);
//       else {
//         setStates([]);
//         toast({
//           variant: "destructive",
//           title: `Uh oh! We couldn't find any Applications create during this ${format(
//             month,
//             "MMMM MM/yyyy"
//           )}.`,
//         });
//       }
//     } catch (error) {
//       setStates([]);
//       toast({
//         variant: "destructive",
//         title: "Uh oh! Something went wrong.",
//         description: `Failed to fetch The Applications, ${handleError(error)}`,
//       });
//     }
//   };

//   useEffect(() => {
//     fetchAllApplications();
//     fetchUnseenApplicationsNumber();
//   }, [currentPage]);

//   useEffect(() => {
//     if (fetchByApplicantName) fetchCstNameQuests(fetchByApplicantName);
//     else if (fetchByDay) fetchDayApplications(fetchByDay);
//     else if (fetchByMonth) fetchMonthApplications(fetchByMonth);
//   }, [fetchByApplicantName, fetchByDay, fetchByMonth]);

//   const pageNumbers = [];
//   for (let i = 0; i < totalPages; i++) pageNumbers.push(i + 1);

//   const isSelected = applicationsActions.some(
//     (selectedApplication) => selectedApplication.checked
//   );

//   return (
//     <div className="flex flex-col gap-3">
//       <div className="flex flex-col gap-5 items-center text-bold">
//         <UpdateBtn
//           updateTarget="Fetch All Applications"
//           handleClick={fetchAllApplications}
//         />
//         <div className="flex flex-col md:flex-row justify-between gap-2 w-full">
//           <input
//             type="text"
//             className="fetch-input-style text-style"
//             placeholder="Fetch By Applicant Name"
//             value={fetchByApplicantName}
//             onChange={handleApplicantNameChange}
//           />
//           <DatePicker
//             selected={fetchByMonth}
//             onChange={handleMonthChange}
//             dateFormat="MM-yyyy"
//             showMonthYearPicker
//             placeholderText="Fetch By Month"
//             className="fetch-input-style text-style whitespace-nowrap"
//           />
//           <DatePicker
//             selected={fetchByDay}
//             onChange={handleDayChange}
//             dateFormat="dd-MM-yyyy"
//             placeholderText="Fetch By Day"
//             className="fetch-input-style text-style whitespace-nowrap"
//           />
//         </div>
//       </div>

//       <Table className="w-full">
//         <TableHeader>
//           <TableRow>
//             <TableHead className="table-head">
//               <input
//                 type="checkbox"
//                 className="h-[18px] w-[18px]"
//                 checked={selectAll}
//                 onChange={handleSelectAll}
//               />
//             </TableHead>
//             <TableHead className="table-head">Client</TableHead>
//             <TableHead className="table-head">Location</TableHead>
//             <TableHead className="table-head">Days</TableHead>
//             <TableHead className="table-head">Hours</TableHead>
//             <TableHead className="table-head">Kids</TableHead>
//             <TableHead className="table-head">Age</TableHead>
//             <TableHead className="table-head">Total Hours</TableHead>
//             <TableHead className="table-head">Date</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {applications.map((application, index) => {
//             const {
//               cstName,
//               location,
//               to,
//               from,
//               numberOfHours,
//               numberOfKids,
//               ageOfKidsFrom,
//               ageOfKidsTo,
//               createdAt,
//             } = application;
//             const totalDays =
//               differenceInDays(new Date(to), new Date(from)) + 1;
//             const totalHours = totalDays * parseInt(numberOfHours);
//             return (
//               <React.Fragment key={application._id}>
//                 <TableRow
//                   className={`${application.seen ? "" : "text-blue-500"}`}
//                 >
//                   <TableCell className="table-cell text-center ">
//                     <input
//                       type="checkbox"
//                       className="h-[18px] w-[18px] cursor-pointer"
//                       checked={applicationsActions[index].checked}
//                       onChange={() => handleSelectApplication(application._id)}
//                     />
//                   </TableCell>
//                   <TableCell className="table-cell">{cstName}</TableCell>
//                   <TableCell
//                     className={`table-cell ${
//                       location === "Abu Dhabi" ? "" : "text-red-500"
//                     }`}
//                   >
//                     {location}
//                   </TableCell>
//                   <TableCell className="table-cell">{totalDays}</TableCell>
//                   <TableCell className="table-cell">{numberOfHours}</TableCell>
//                   <TableCell className="table-cell">{numberOfKids}</TableCell>
//                   <TableCell className="table-cell">
//                     {ageOfKidsFrom === ageOfKidsTo
//                       ? ageOfKidsFrom
//                       : `${ageOfKidsFrom} - ${ageOfKidsTo}`}
//                   </TableCell>
//                   <TableCell className="table-cell">{totalHours}</TableCell>
//                   <TableCell className="table-cell">
//                     {formatMongoDbDate(createdAt)}
//                   </TableCell>
//                 </TableRow>
//                 {applicationsActions[index].checked && (
//                   <ApplicationCard
//                     application={application}
//                     handleDeleteApplication={handleDeleteApplication}
//                     handleBlockUser={handleBlockUser}
//                   />
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </TableBody>
//       </Table>

//       <PagePagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         pageNumbers={pageNumbers}
//         setCurrentPage={setCurrentPage}
//       />

//       {isSelected && (
//         <UserDeleteBtn
//           deletionTarget="Delete Selected Applications"
//           handleClick={handleDeleteSelectedApplications}
//         />
//       )}
//     </div>
//   );
// };

// export default Application;
