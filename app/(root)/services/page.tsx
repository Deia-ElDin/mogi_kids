"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { IPage } from "@/lib/database/models/page.model";
import { IService } from "@/lib/database/models/service.model";
import { getUserByClerkId } from "@/lib/actions/user.actions";
import { getPageByPageName } from "@/lib/actions/page.actions";
import { getAllServices } from "@/lib/actions/service.actions";
import { getPageTitle, getPageContent } from "@/lib/utils";
import Article from "@/components/shared/helpers/Article";
import ServicesSwiper from "@/components/shared/swiper/ServicesSwiper";
import Loading from "@/components/shared/helpers/Loading";

const Services: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>();
  const [servicesPage, setServicesPage] = useState<IPage | undefined>();
  const [services, setServices] = useState<IService[] | []>();
  const [loading, setLoading] = useState<boolean>(true);

  const { user: clerkUser } = useUser();

  const pageTitle = getPageTitle(servicesPage, isAdmin, "Services Page Title");
  const pageContent = getPageContent(servicesPage, isAdmin);

  useEffect(() => {
    const fetchData = async () => {
      if (clerkUser) {
        const user = await getUserByClerkId(clerkUser.id);
        setIsAdmin(user?.role === "Admin");
      }

      const servicesPage = await getPageByPageName("Services Page");
      const services = await getAllServices();

      setServicesPage(servicesPage);
      setServices(services);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (!servicesPage && loading) return <Loading />;

  return (
    <section className="section-style">
      <Article title={pageTitle} content={pageContent} />
      <ServicesSwiper services={services || []} />
    </section>
  );
};

export default Services;
