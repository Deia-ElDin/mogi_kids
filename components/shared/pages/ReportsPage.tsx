// "use client";

// import React, { useState, useEffect } from "react";
// import { format, isBefore } from "date-fns";
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
//   getAllReports,
//   deleteReport,
//   deleteSelectedReports,
//   markReportAsSeen,
// } from "@/lib/actions/report.actions";
// import { blockUser } from "@/lib/actions/user.actions";
// import { IReport } from "@/lib/database/models/report.model";
// import { differenceInDays } from "date-fns";
// import { formatDate, sortReports, handleError, toCap } from "@/lib/utils";
// import { ReportsSortKey } from "@/constants";
// import UpdateBtn from "../btns/UpdateBtn";
// import PagePagination from "../helpers/PagePagination";
// import DatePicker from "react-datepicker";
// import UserDeleteBtn from "../btns/UserDeleteBtn";
// import ReportCard from "../cards/ReportCard";
// import "react-datepicker/dist/react-datepicker.css";

// type ReportsPageProps = {
//   setUnseenApplicants: React.Dispatch<React.SetStateAction<number | null>>;
// };

// type FetchState = {
//   applicantName?: string;
//   email?: string;
//   day?: Date | null;
//   month?: Date | null;
// };

// type reportsActionsState = {
//   _id: string;
//   checked: boolean;
// };

// const ReportsPage: React.FC<ReportsPageProps> = ({
//   setUnseenApplicants,
// }) => {
//   const limit = 10;
//   const [fetchBy, setFetchBy] = useState<FetchState>({
//     applicantName: "",
//     email: "",
//     day: null,
//     month: null,
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [reports, setReports] = useState<IReport[] | []>([]);
//   const [reportsActions, setReportsActions] = useState<
//     reportsActionsState[]
//   >([]);
//   const [selectAll, setSelectAll] = useState<boolean>(false);
//   const [selectedReports, setSelectedReports] = useState<string[]>(
//     []
//   );
//   const [sortConfig, setSortConfig] = useState<{
//     key: ReportsSortKey;
//     direction: string;
//   } | null>(null);

//   const { toast } = useToast();

//   const today = new Date();

//   const setStates = (data: IReport[], allPages: number = 1) => {
//     setReports(data || []);
//     setTotalPages(allPages);
//     setReportsActions(
//       data?.map((report: IReport) => ({
//         _id: report._id,
//         checked: false,
//       })) || []
//     );
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

//   const handleSelectReport = async (reportId: string) => {
//     // we set the reports actions to opposite of the prev state
//     setReportsActions((prev) =>
//       prev.map((report) =>
//         report._id === reportId
//           ? { ...report, checked: !report.checked }
//           : report
//       )
//     );

//     // we check if the report is already in the selected reports array
//     const isExist = selectedReports.find((id) => id === reportId);

//     // if it's exist we remove it from the selected reports array else we add it
//     setSelectedReports((prev) =>
//       isExist
//         ? prev.filter((id) => id !== reportId)
//         : [...prev, reportId]
//     );

//     // we find the selected report from the reports array
//     const selected = reports.find(
//       (report) => report._id === reportId
//     );

//     // if the selected report is not seen we mark it as seen
//     if (selected && !selected.seen) {
//       const { success, data, error } = await markReportAsSeen(
//         reportId
//       );

//       if (!success && error) {
//         toast({
//           variant: "destructive",
//           title: "Uh oh! Something went wrong.",
//           description: `Failed to Update The Quotation, ${handleError(error)}`,
//         });
//       }

//       if (data) {
//         setReports(
//           reports.map((report) =>
//             report._id === reportId ? data : report
//           )
//         );
//       }
//     }
//     if (selectAll) setSelectAll(false);
//   };

//   const handleSelectAll = () => {
//     setSelectedReports(reports.map((report) => report._id));
//     setReportsActions((prev) =>
//       prev.map((report) => ({
//         ...report,
//         checked: !selectAll,
//       }))
//     );
//     setSelectAll((prev) => !prev);
//   };

//   const handleDeleteReport = async (reportId: string) => {
//     try {
//       const { success, data, totalPages, error } = await deleteReport({
//         reportId,
//         page: currentPage,
//         limit,
//       });

//       if (!success && error) throw new Error(error);

//       if (reports.length === selectedReports.length) {
//         setStates([]);
//       } else {
//         const { applicantName, email, day, month } = fetchBy;
//         if (applicantName || email || day || month) {
//           const newReports = reports.filter(
//             (report) => report._id !== reportId
//           );
//           setStates(newReports);
//         } else if (data) setStates(data, totalPages);
//       }

//       setReports((prevReports) =>
//         prevReports.filter(
//           (report) => report._id !== reportId
//         )
//       );
//       setReportsActions((prevReportsActions) =>
//         prevReportsActions.filter(
//           (report) => report._id !== reportId
//         )
//       );
//       toast({ description: "Quotation Deleted Successfully." });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Uh oh! Something went wrong.",
//         description: `Failed to Delete The Quotation, ${handleError(error)}`,
//       });
//     }
//   };

//   const handleDeleteSelectedReports = async () => {
//     try {
//       const { success, data, totalPages, error } =
//         await deleteSelectedReports({
//           selectedReports,
//           page: currentPage,
//         });

//       if (!success && error) throw new Error(error);
//       toast({ description: "Quotation Selection Deleted Successfully." });

//       if (reports.length === selectedReports.length) {
//         setStates([]);
//       } else {
//         const { applicantName, email, day, month } = fetchBy;
//         if (applicantName || email || day || month) {
//           const newReports = reports.filter(
//             (report) => !selectedReports.includes(report._id)
//           );
//           setStates(newReports);
//         } else if (data) setStates(data, totalPages);
//       }
//       setSelectedReports([]);
//       setSelectAll(false);
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Uh oh! Something went wrong.",
//         description: `Failed to Delete The Quotation Selection, ${handleError(
//           error
//         )}`,
//       });
//     }
//   };

//   const fetchAllReports = async (fetchBy: FetchState) => {
//     const {
//       applicantName = "",
//       email = "",
//       day = null,
//       month = null,
//     } = fetchBy;

//     try {
//       const { success, data, totalPages, unseen, error } =
//         await getAllReports({
//           fetch: fetchBy,
//           limit,
//           page: currentPage,
//         });

//       if (!success && error) throw new Error(error);
//       if (unseen) setUnseenApplicants(unseen);
//       if (success && data && data?.length > 0) setStates(data, totalPages);
//       else {
//         setUnseenApplicants(null);
//         let extraMsg = "yet in the Database.";
//         if (applicantName) extraMsg = `by ${applicantName}.`;
//         else if (email) extraMsg = `by ${email}.`;
//         else if (day) extraMsg = `at ${format(day, "EEE, dd/MM/yyyy")}.`;
//         else if (month) extraMsg = `during ${format(month, "MMMM MM/yyyy")}.`;
//         setStates([]);
//         toast({
//           variant: "destructive",
//           title: `Uh oh! We couldn't find any Reports created ${extraMsg}.`,
//         });
//       }
//     } catch (error) {
//       setUnseenApplicants(null);
//       setStates([]);
//       toast({
//         variant: "destructive",
//         title: "Uh oh! Something went wrong.",
//         description: `Failed to fetch The Reports, ${handleError(error)}`,
//       });
//     }
//   };

//   const requestSort = (key: ReportsSortKey) => {
//     let direction = "ascending";
//     if (
//       sortConfig &&
//       sortConfig.key === key &&
//       sortConfig.direction === "ascending"
//     ) {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//   };

//   useEffect(() => {
//     fetchAllReports(fetchBy);
//   }, [currentPage]);

//   useEffect(() => {
//     if (sortConfig) {
//       const sortedReports = sortReports(
//         reports,
//         sortConfig.key,
//         sortConfig.direction
//       );
//       setReports(sortedReports);
//       setReportsActions(
//         sortedReports?.map((report: IReport) => ({
//           _id: report._id,
//           checked: false,
//         })) || []
//       );
//     }
//   }, [sortConfig]);

//   useEffect(() => {
//     setCurrentPage(1);
//     const { applicantName, email, day, month } = fetchBy;

//     if (applicantName) fetchAllReports({ applicantName });
//     else if (email) fetchAllReports({ email });
//     else if (day) fetchAllReports({ day });
//     else if (month) fetchAllReports({ month });
//   }, [fetchBy]);

//   const pageNumbers = [];
//   for (let i = 0; i < totalPages; i++) pageNumbers.push(i + 1);

//   const isSelected = reportsActions.some(
//     (selectedReport) => selectedReport.checked
//   );

//   const TrueImage = ({ condition }: { condition: boolean }) => (
//     <img
//       src={`/assets/icons/${condition ? "true" : "false"}.svg`}
//       alt="True/false icon"
//       height={20}
//       width={20}
//       className="m-auto"
//     />
//   );

//   const TableHeaderComp = () => (
//     <TableHeader>
//       <TableRow>
//         <TableHead className="table-head">
//           <input
//             type="checkbox"
//             className="h-[18px] w-[18px]"
//             checked={selectAll}
//             onChange={handleSelectAll}
//           />
//         </TableHead>
//         <TableHead className="table-head">Applicant</TableHead>
//         {[
//           { label: "Gender", key: ReportsSortKey.GENDER },
//           { label: "DHA", key: ReportsSortKey.DHA },
//           { label: "CGC", key: ReportsSortKey.CGC },
//           { label: "Salary", key: ReportsSortKey.SALARY },
//           {
//             label: "Visa Expiry Date",
//             key: ReportsSortKey.VISA_EXPIRY_DATE,
//           },
//           { label: "Joining Date", key: ReportsSortKey.JOIN_DATE },
//           { label: "Joining Days", key: ReportsSortKey.DAYS },
//           { label: "Created At", key: ReportsSortKey.DATE },
//         ].map((item) => (
//           <TableHead
//             key={item.label}
//             className="table-head"
//             onClick={() => requestSort(item.key)}
//           >
//             {item.label}
//           </TableHead>
//         ))}
//       </TableRow>
//     </TableHeader>
//   );

//   const TableBodyComp = () => (
//     <TableBody>
//       {reports.map((report, index) => {
//         const {
//           fullName,
//           expectedSalary,
//           joinDate,
//           gender,
//           dhaCertificate,
//           careGiverCertificate,
//           visaExpireDate,
//           imgUrl,
//           seen,
//           createdAt,
//         } = report;
//         const diffInDays = differenceInDays(new Date(joinDate), today);
//         const isVisaExpired = isBefore(new Date(visaExpireDate), today);
//         const isJoiningExpired = isBefore(new Date(joinDate), today);

//         return (
//           <React.Fragment key={report._id}>
//             <TableRow
//               className={`cursor-pointer ${seen ? "" : "text-blue-500"}`}
//               onClick={() => handleSelectReport(report._id)}
//             >
//               <TableCell className="table-cell text-center">
//                 <input
//                   type="checkbox"
//                   className="h-[18px] w-[18px] cursor-pointer"
//                   checked={reportsActions[index].checked}
//                   onChange={(e) => e.stopPropagation()}
//                 />
//               </TableCell>
//               <TableCell className="table-cell">
//                 {toCap(fullName.split(" ")[0])}
//               </TableCell>
//               <TableCell
//                 className={`table-cell ${
//                   gender.toLowerCase() === "female" ? "" : "text-red-500"
//                 }`}
//               >
//                 {toCap(gender)}
//               </TableCell>
//               <TableCell className="table-cell">
//                 <TrueImage condition={dhaCertificate.toLowerCase() === "yes"} />
//               </TableCell>
//               <TableCell className="table-cell">
//                 <TrueImage
//                   condition={careGiverCertificate.toLowerCase() === "yes"}
//                 />
//               </TableCell>
//               <TableCell className="table-cell">{expectedSalary}</TableCell>
//               <TableCell
//                 className={`table-cell ${isVisaExpired ? "text-red-500" : ""}`}
//               >
//                 {formatDate(String(visaExpireDate))}
//               </TableCell>
//               <TableCell
//                 className={`table-cell ${
//                   isJoiningExpired ? "text-red-500" : ""
//                 }`}
//               >
//                 {formatDate(String(joinDate))}
//               </TableCell>
//               <TableCell
//                 className={`table-cell ${diffInDays > 0 ? "" : "text-red-500"}`}
//               >
//                 {diffInDays > 0 ? diffInDays : diffInDays}
//               </TableCell>

//               <TableCell className="table-cell">
//                 {formatDate(String(createdAt))}
//               </TableCell>
//             </TableRow>
//             {reportsActions[index].checked && (
//               <ReportCard
//                 report={report}
//                 handleDeleteReport={handleDeleteReport}
//                 handleBlockUser={handleBlockUser}
//               />
//             )}
//           </React.Fragment>
//         );
//       })}
//     </TableBody>
//   );

//   return (
//     <div className="flex flex-col gap-3">
//       <div className="flex flex-col gap-5 items-center text-bold">
//         <UpdateBtn
//           updateTarget="Fetch All Reports"
//           handleClick={() => fetchAllReports({})}
//         />
//         <div className="flex flex-col gap-2 w-full">
//           <div className="flex gap-10 w-full">
//             <input
//               type="text"
//               className="fetch-input-style text-style"
//               placeholder="Fetch By Client Name"
//               value={fetchBy.applicantName}
//               onChange={(e) =>
//                 setFetchBy({
//                   applicantName: e.target.value,
//                   email: "",
//                   day: null,
//                   month: null,
//                 })
//               }
//             />
//             <input
//               type="text"
//               className="fetch-input-style text-style"
//               placeholder="Fetch By Client Email"
//               value={fetchBy.email}
//               onChange={(e) =>
//                 setFetchBy({
//                   applicantName: "",
//                   email: e.target.value,
//                   day: null,
//                   month: null,
//                 })
//               }
//             />
//           </div>
//           <div className="flex gap-10 justify-center">
//             <DatePicker
//               selected={fetchBy.day}
//               onChange={(date: Date) =>
//                 setFetchBy({
//                   applicantName: "",
//                   email: "",
//                   day: date,
//                   month: null,
//                 })
//               }
//               dateFormat="dd-MM-yyyy"
//               placeholderText="Fetch By Day"
//               className="fetch-input-style text-style"
//             />
//             <DatePicker
//               selected={fetchBy.month}
//               onChange={(date: Date) =>
//                 setFetchBy({
//                   applicantName: "",
//                   email: "",
//                   day: null,
//                   month: date,
//                 })
//               }
//               dateFormat="MM-yyyy"
//               showMonthYearPicker
//               placeholderText="Fetch By Month"
//               className="fetch-input-style text-style"
//             />
//           </div>
//         </div>
//       </div>

//       <Table className="w-full">
//         <TableHeaderComp />
//         <TableBodyComp />
//       </Table>

//       <PagePagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         pageNumbers={pageNumbers}
//         setCurrentPage={setCurrentPage}
//       />

//       {isSelected && (
//         <UserDeleteBtn
//           deletionTarget="Delete Selected Reports"
//           handleClick={handleDeleteSelectedReports}
//         />
//       )}
//     </div>
//   );
// };

// export default ReportsPage;
