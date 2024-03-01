import { getPageByPageName } from "@/lib/actions/page.actions";
import { getAllServices } from "@/lib/actions/service.actions";
import { getPageTitle, getPageContent } from "@/lib/utils";
import Article from "@/components/shared/helpers/Article";
import ServicesSwiper from "@/components/shared/swiper/ServicesSwiper";

const Services: React.FC = async () => {
  const pageResult = await getPageByPageName("Services Page");
  const servicesResult = await getAllServices();

  const page = pageResult.success ? pageResult.data || null : null;
  const services = servicesResult.success ? servicesResult.data || [] : [];

  const pageTitle = getPageTitle(page, false, "Services Page Title");
  const pageContent = getPageContent(page, false);

  return (
    <section className="section-style">
      <Article title={pageTitle} content={pageContent} />
      <ServicesSwiper services={services} />
    </section>
  );
};

export default Services;
