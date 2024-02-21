"use client";

import { IPage } from "@/lib/database/models/page.model";
import { IService } from "@/lib/database/models/service.model";
import { deletePage } from "@/lib/actions/page.actions";
import { deleteAllServices } from "@/lib/actions/service.actions";
import { getPageTitle, getPageContent } from "@/lib/utils";
import { handleError } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Article from "@/components/shared/helpers/Article";
import ServicesSwiper from "@/components/shared/swiper/ServicesSwiper";
import ServiceForm from "@/components/shared/forms/ServiceForm";
import PageForm from "@/components/shared/forms/PageForm";
import DeleteBtn from "@/components/shared/btns/DeleteBtn";

type ServicesProps = {
  isAdmin: boolean | undefined;
  servicesPage: IPage | Partial<IPage>;
  services: IService[] | [];
};

const Services: React.FC<ServicesProps> = ({
  isAdmin,
  servicesPage,
  services,
}) => {
  const pageTitle = getPageTitle(servicesPage, isAdmin, "Services Section Title");
  const pageContent = getPageContent(servicesPage, isAdmin);

  const handleDelete = async () => {
    try {
      if (servicesPage?._id) await deletePage(servicesPage._id, "/");
      if (services.length > 0) await deleteAllServices();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <section className="section-style">
      <Article title={pageTitle} content={pageContent} />
      <ServicesSwiper services={services || []} />
      {isAdmin && <PageForm page={servicesPage} pageName="Services Page" />}
      {isAdmin && servicesPage?._id && <ServiceForm service={null} />}
      <DeleteBtn
        pageId={servicesPage?._id}
        isAdmin={isAdmin}
        deletionTarget="Services Section"
        handleClick={handleDelete}
      />
      <Separator pageId={servicesPage?._id} isAdmin={isAdmin} />
    </section>
  );
};

export default Services;
