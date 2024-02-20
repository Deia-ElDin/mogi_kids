import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { getUserByClerkId } from "./actions/user.actions";
import { getAllPages } from "./actions/page.actions";
import { getAllServices } from "./actions/service.actions";
import { IPage } from "./database/models/page.model";
import { IUser } from "./database/models/user.model";
import { IService } from "./database/models/service.model";
import Loading from "@/components/shared/helpers/Loading";

type FetchedData = {
  user: IUser | null;
  pages: IPage[];
  services: IService[];
  isAdmin: boolean;
};

// Create a new context
const DataContext = createContext<FetchedData | undefined>(undefined);

export const DataProvider: React.FC = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<IUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [pages, setPages] = useState<IPage[]>([]); // Removed the empty array here
  const [services, setServices] = useState<IService[]>([]); // Removed the empty array here

  useEffect(() => {
    const fetchData = async () => {
      try {
        let dbUser = null;
        if (clerkUser) {
          dbUser = await getUserByClerkId(clerkUser.id);
          setIsAdmin(dbUser?.role === "Admin" ?? false);
        }
        setUser(dbUser);
        setPages(await getAllPages());
        setServices(await getAllServices());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [clerkUser]);

  if (!user || !pages.length || !services.length) {
    return <Loading />;
  }

  return (
    <DataContext.Provider
      value={{
        user,
        pages,
        services,
        isAdmin,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
