import { auth } from "@clerk/nextjs";

import { IUser } from "@/lib/database/models/user.model";
import { IPage } from "@/lib/database/models/page.model";
import { IService } from "@/lib/database/models/service.model";
import { IQuestion } from "@/lib/database/models/question.model";
import { IRecord } from "@/lib/database/models/record.model";
import { IReview } from "@/lib/database/models/review.model";
import { IContact } from "@/lib/database/models/contact.model";

import { getUserByUserId, getAllUsers } from "@/lib/actions/user.actions";
import { getLogo } from "@/lib/actions/logo.actions";
import { getAllPages } from "@/lib/actions/page.actions";
import { getAllServices } from "@/lib/actions/service.actions";
import { getAllQuestions } from "@/lib/actions/question.actions";
import { getAllRecords } from "@/lib/actions/record.actions";
import { getAllReviews } from "@/lib/actions/review.actions";
import { getAllContacts } from "@/lib/actions/contact.actions";
import { getAllAboutUs } from "@/lib/actions/aboutUs.actions";

import { findPage, formatBytes, getUsername } from "@/lib/utils";

import Admin from "@/components/shared/Admin";
import Welcome from "@/components/shared/Welcome";
import Services from "@/components/shared/Services";
import Questions from "@/components/shared/Questions";
import Records from "@/components/shared/Records";
import Customers from "@/components/shared/Customers";
import Quote from "@/components/shared/Quote";
import Contacts from "@/components/shared/Contacts";
import { ILogo } from "@/lib/database/models/logo.model";

export default async function Home() {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const user: IUser = await getUserByUserId(userId);
  const { data: logo } = await getLogo();
  const pages: IPage[] = await getAllPages();
  const services: IService[] = await getAllServices();
  const questions: IQuestion[] = await getAllQuestions();
  const records: IRecord[] = await getAllRecords();
  const reviews: IReview[] = await getAllReviews();
  const contacts: IContact[] = await getAllContacts();
  const aboutUs = await getAllAboutUs();
  const isAdmin = user?.role === "Admin";

  // const allUsers = await getAllUsers();
  // logo
  console.log("size = ", formatBytes(services, records));

  // console.log("allUsers = ", allUsers);
  // allUsers.map((user) => {
  //   console.log("username = ", getUsername(user.firstName, user.lastName));
  // });

  return (
    <>
      <Admin isAdmin={isAdmin} logo={logo} />
      <Welcome
        isAdmin={isAdmin}
        welcomePage={findPage(pages, "Welcome Page")}
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
        user={user}
        isAdmin={isAdmin}
        quotePage={findPage(pages, "Quote Page")}
      />
      <Contacts
        isAdmin={isAdmin}
        contactsPage={findPage(pages, "Contacts Page")}
        contacts={contacts}
      />
    </>
  );
}

// function to handle a certain amount of chars
// handle reviewCard responsive mode
