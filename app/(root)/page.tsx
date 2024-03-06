import { auth } from "@clerk/nextjs";

import { getUserByUserId } from "@/lib/actions/user.actions";
import { getLogo } from "@/lib/actions/logo.actions";
import { getGallery } from "@/lib/actions/gallery.actions";
import { getAllPages } from "@/lib/actions/page.actions";
import { getAllServices } from "@/lib/actions/service.actions";
import { getAllQuestions } from "@/lib/actions/question.actions";
import { getAllRecords } from "@/lib/actions/record.actions";
import { getAllReviews } from "@/lib/actions/review.actions";
import { getAllContacts } from "@/lib/actions/contact.actions";
import { getAllAboutUs } from "@/lib/actions/aboutUs.actions";
import { getDbsSize } from "@/lib/actions/db.actions";

import { findPage, formatBytes } from "@/lib/utils";

import Admin from "@/components/shared/Admin";
import Welcome from "@/components/shared/Welcome";
import Services from "@/components/shared/Services";
import Questions from "@/components/shared/Questions";
import Records from "@/components/shared/Records";
import Customers from "@/components/shared/Customers";
import Quote from "@/components/shared/Quote";
import Contacts from "@/components/shared/Contacts";

export default async function Home() {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const userResult = await getUserByUserId(userId);
  const logoResult = await getLogo();
  const galleryResult = await getGallery();
  const pagesResult = await getAllPages();
  const servicesResult = await getAllServices();
  const questionsResult = await getAllQuestions();
  const recordsResult = await getAllRecords();
  const reviewsResult = await getAllReviews();
  const contactsResult = await getAllContacts();
  const aboutUsResult = await getAllAboutUs();
  const dbsSizeResult = await getDbsSize();

  const user = userResult.success ? userResult.data || null : null;
  const logo = logoResult.success ? logoResult.data || null : null;
  const gallery = galleryResult.success ? galleryResult.data || [] : [];
  const pages = pagesResult.success ? pagesResult.data || [] : [];
  const services = servicesResult.success ? servicesResult.data || [] : [];
  const questions = questionsResult.success ? questionsResult.data || [] : [];
  const records = recordsResult.success ? recordsResult.data || [] : [];
  const reviews = reviewsResult.success ? reviewsResult.data || [] : [];
  const contacts = contactsResult.success ? contactsResult.data || [] : [];
  const aboutUs = aboutUsResult.success ? aboutUsResult.data || [] : [];

  console.log("reviews", reviews);

  const dbsSize = dbsSizeResult.success ? dbsSizeResult.data || null : null;
  console.log("dbsSize", dbsSize);

  const isAdmin = user?.role === "Admin";

  const uploadthingDb = formatBytes(
    logo,
    gallery,
    services,
    records,
    contacts,
    aboutUs
  );

  return (
    <>
      <Admin
        isAdmin={isAdmin}
        logo={logo}
        gallery={gallery}
        uploadthingDb={uploadthingDb}
        resend={0}
      />
      <Welcome
        isAdmin={isAdmin}
        welcomePage={findPage(pages, "Welcomes Page")}
      />
      <Services
        isAdmin={isAdmin}
        servicesPage={findPage(pages, "Services Page")}
        services={services}
      />
      <Questions
        isAdmin={isAdmin}
        questionsPage={findPage(pages, "Questions Page")}
        questions={questions}
      />
      <Records
        isAdmin={isAdmin}
        recordsPage={findPage(pages, "Records Page")}
        records={records}
      />
      <Customers
        user={user}
        isAdmin={isAdmin}
        customersPage={findPage(pages, "Customers Page")}
        reviews={reviews}
      />
      <Quote
        isAdmin={isAdmin}
        quotePage={findPage(pages, "Quote Page")}
        logo={logo}
      />
      <Contacts
        isAdmin={isAdmin}
        contactsPage={findPage(pages, "Contacts Page")}
        contacts={contacts}
      />
    </>
  );
}
