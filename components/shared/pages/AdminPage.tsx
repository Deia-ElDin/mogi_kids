"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuotePages from "./QuotePages";

const AdminPage: React.FC = () => {
  const [unseenQuotes, setUnseenQuotes] = useState<number | null>(0);
  const [unseenApplicants, setUnseenApplicants] = useState<number | null>(0);

  return (
    <section className="section-style mb-auto">
      <Tabs defaultValue="quotes" className="w-full bg-transparent">
        <TabsList className="w-full h-fit flex p-4 bg-transparent border-t-0 border-r-0 border-l-0 border-b-2 border-custom-red ">
          <TabsTrigger className="tab-trigger relative" value="quotes">
            Quotes
            {unseenQuotes && (
              <p className="absolute top-[-10px] right-[-10px] rounded-full text-white bg-red-500 h-[25px] w-[25px] flex justify-center items-center text-[15px]">
                {unseenQuotes}
              </p>
            )}
          </TabsTrigger>
          <TabsTrigger className="tab-trigger" value="applicants">
            Applicants
          </TabsTrigger>
        </TabsList>
        <TabsContent value="quotes">
          <QuotePages setUnseenQuotes={setUnseenQuotes} />
        </TabsContent>
        <TabsContent value="applicants" className="p-4">
          <QuotePages setUnseenQuotes={setUnseenQuotes} />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AdminPage;
