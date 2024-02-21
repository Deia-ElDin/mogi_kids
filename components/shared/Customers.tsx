"use client";

import { Separator } from "../ui/separator";
import { IPage } from "@/lib/database/models/page.model";
import { IReview } from "@/lib/database/models/review.model";
import { getPageTitle, getPageContent } from "@/lib/utils";
import { deletePage } from "@/lib/actions/page.actions";
import { handleError } from "@/lib/utils";
import Article from "@/components/shared/helpers/Article";
import ReviewsSwiper from "./swiper/reviewsSwiper";
import PageForm from "@/components/shared/forms/PageForm";
import DeleteBtn from "@/components/shared/btns/DeleteBtn";

type CustomersProps = {
  isAdmin: boolean | undefined;
  customersPage: IPage | Partial<IPage> | undefined;
  customersWelcomingPage: IPage | Partial<IPage> | undefined;
  reviews: IReview[] | [];
};

const Customers = ({
  isAdmin,
  customersPage,
  reviews,
  customersWelcomingPage,
}: CustomersProps) => {
  const pageTitle = getPageTitle(
    customersPage,
    isAdmin,
    "Customers Section Title"
  );
  const pageContent = getPageContent(customersPage, isAdmin);

  const handleDelete = async () => {
    try {
      if (customersPage?._id) await deletePage(customersPage._id, "/");
      // if (services.length > 0) await deleteAllServices();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <section id="customers" className="section-style">
      <Article title={pageTitle} content={pageContent} />
      <ReviewsSwiper reviews={reviews || []} />
      {isAdmin && <PageForm page={customersPage} pageName="Customers Page" />}
      {isAdmin && (
        <PageForm
          page={customersWelcomingPage}
          pageName="Customers Welcoming Page"
        />
      )}
      <DeleteBtn
        pageId={customersPage?._id}
        isAdmin={isAdmin}
        deletionTarget="Delete Services Section"
        handleClick={handleDelete}
      />
      <Separator pageId={customersPage?._id} isAdmin={isAdmin} />
    </section>
  );
};

export default Customers;

// Our Customers, Both Parents and Children, Are Our Priority
// We take immense pride in the service we provide to our customers. Our customer reviews reflect the high level of customer satisfaction that we have achieved.
