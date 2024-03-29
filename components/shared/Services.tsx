"use client";

import { IPage } from "@/lib/database/models/page.model";
import { IService } from "@/lib/database/models/service.model";
import { deletePage } from "@/lib/actions/page.actions";
import { deleteAllServices } from "@/lib/actions/service.actions";
import { getPageTitle, getPageContent } from "@/lib/utils";
import { handleError } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import Article from "@/components/shared/helpers/Article";
import ServicesSwiper from "@/components/shared/swiper/ServicesSwiper";
import PageForm from "@/components/shared/forms/PageForm";
import CreateServiceForm from "@/components/shared/forms/CreateServiceForm";
import DeleteBtn from "@/components/shared/btns/DeleteBtn";

type ServicesProps = {
  isAdmin: boolean | undefined;
  servicesPage: IPage | Partial<IPage>;
  services: IService[];
};

const Services: React.FC<ServicesProps> = (props) => {
  const { isAdmin, servicesPage, services } = props;

  const { toast } = useToast();

  const pageTitle = getPageTitle(
    servicesPage,
    isAdmin,
    "Services Section Title"
  );

  const pageContent = getPageContent(servicesPage, isAdmin);

  const handleDelete = async () => {
    try {
      if (servicesPage?._id) {
        const { success, error } = await deletePage(servicesPage._id, "/");
        if (!success && error) {
          if (typeof error === "string") {
            throw new Error(error);
          } else {
            throw error;
          }
        }
      }
      if (services.length > 0) {
        const { success, error } = await deleteAllServices();
        if (!success && error) {
          if (typeof error === "string") {
            throw new Error(error);
          } else {
            throw error;
          }
        }
      }
      toast({ description: "Services Page Deleted Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete Either The Services Page or the Services, ${handleError(
          error
        )}`,
      });
    }
  };

  return (
    <section className="section-style relative">
      <Article title={pageTitle} content={pageContent} />
      <ServicesSwiper services={services} />
      {isAdmin && <PageForm page={servicesPage} pageName="Services Page" />}
      {isAdmin && servicesPage?._id && <CreateServiceForm />}
      <DeleteBtn
        pageId={servicesPage?._id}
        isAdmin={isAdmin}
        deletionTarget="Delete Services Section"
        handleClick={handleDelete}
      />
      <Separator pageId={servicesPage?._id} isAdmin={isAdmin} />
    </section>
  );
};

export default Services;
