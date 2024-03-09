"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toCap } from "@/lib/utils";
import QuotePage from "./QuotePage";
// import ApplicationPage from "./ApplicationPage";

const AdminPage: React.FC = () => {
  const [displayPage, setDisplayPage] = useState<string>("quotes");
  const [unseenQuotes, setUnseenQuotes] = useState<number | null>(null);
  const [unseenApplicants, setUnseenApplicants] = useState<number | null>(null);

  const tabsArray = [
    { value: "quotes", count: unseenQuotes },
    { value: "applicants", count: unseenApplicants },
  ];

  return (
    <section className="section-style mb-auto">
      <Tabs defaultValue="quotes" className="w-full bg-transparent">
        <TabsList className="w-full h-fit flex gap-4 bg-transparent border-t-0 border-r-0 border-l-0 border-b-2 border-custom-red ">
          {tabsArray.map((item) => (
            <TabsTrigger
              key={item.value}
              className="tab-trigger relative"
              value={item.value}
              onClick={() => setDisplayPage(item.value)}
            >
              {toCap(item.value)}
              {item.count && <p className="notification-style">{item.count}</p>}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="quotes">
          {displayPage === "quotes" && (
            <QuotePage setUnseenQuotes={setUnseenQuotes} />
          )}
        </TabsContent>
        {/* <TabsContent value="applicants">
          {displayPage === "applicants" && (
            <ApplicationPage setUnseenApplicants={setUnseenApplicants} />
          )}
        </TabsContent> */}
      </Tabs>
    </section>
  );
};

export default AdminPage;
