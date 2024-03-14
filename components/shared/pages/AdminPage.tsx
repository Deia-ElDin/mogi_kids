"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toCap } from "@/lib/utils";
import QuotesPage from "./QuotesPage";
import ApplicationsPage from "./ApplicationsPage";
import UsersPage from "./UsersPage";
import ReportsPage from "./ReportsPage";

const AdminPage: React.FC = () => {
  const [unseenQuotes, setUnseenQuotes] = useState<number | null>(null);
  const [unseenApplicants, setUnseenApplicants] = useState<number | null>(null);
  const [unseenReports, setUnseenReports] = useState<number | null>(null);

  console.log("unseenReports", unseenReports);
  
  const tabsArray = [
    { value: "quotes", count: unseenQuotes },
    { value: "applicants", count: unseenApplicants },
    { value: "users", count: null },
    { value: "reports", count: unseenReports },
  ];

  return (
    <section className="flex flex-col w-[90%] py-4 relative mb-auto">
      <Tabs defaultValue="quotes" className="w-full bg-transparent">
        <TabsList className="w-full h-fit flex gap-4 bg-transparent border-t-0 border-r-0 border-l-0 border-b-2 border-custom-red ">
          {tabsArray.map((item) => (
            <TabsTrigger
              key={item.value}
              className="tab-trigger relative"
              value={item.value}
            >
              {toCap(item.value)}
              {item.count && <p className="notification-style">{item.count}</p>}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="quotes">
          <QuotesPage setUnseenQuotes={setUnseenQuotes} />
        </TabsContent>
        <TabsContent value="applicants">
          <ApplicationsPage setUnseenApplicants={setUnseenApplicants} />
        </TabsContent>
        <TabsContent value="users">
          <UsersPage />
        </TabsContent>
        <TabsContent value="reports">
          <ReportsPage setUnseenReports={setUnseenReports} />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AdminPage;
