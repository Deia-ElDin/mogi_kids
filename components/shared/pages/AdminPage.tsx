import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuotePages from "./QuotePages";

const AdminPage: React.FC = async () => {
  return (
    <section className="section-style mb-auto">
      <Tabs defaultValue="quotes" className="w-full bg-transparent">
        <TabsList className="w-full h-fit flex p-4 bg-transparent border-t-0 border-r-0 border-l-0 border-b-2 border-custom-red">
          <TabsTrigger className="tab-trigger" value="quotes">
            Quotes
          </TabsTrigger>
          <TabsTrigger className="tab-trigger" value="applicants">
            Applicants
          </TabsTrigger>
        </TabsList>
        <TabsContent value="quotes">
          <QuotePages />
        </TabsContent>
        <TabsContent value="applicants" className="p-4">
          <QuotePages />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AdminPage;
