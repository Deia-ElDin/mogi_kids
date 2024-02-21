"use client"

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

type ServicePageProps = {
  params: { id: string };
};

const UserPage = ({ params: { id } }: ServicePageProps) => {
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>();
  const [servicesPage, setServicesPage] = useState<IPage | undefined>();
  const [services, setServices] = useState<IService[] | []>();
  const [loading, setLoading] = useState<boolean>(true);
  
  return <section className="section-style"></section>;
};

export default UserPage;

/**
 * Welcome to MogiKids Child Care Website!
 *
 * At MogiKids, we're dedicated to providing a safe, nurturing, and enriching environment
 * for your children. Our team of passionate educators and caregivers are committed to
 * fostering the growth and development of each child, ensuring they thrive in every aspect
 * of their early years.
 *
 * Explore our website to discover our comprehensive range of child care programs, designed
 * to cater to the unique needs of children at different stages of their development. Whether
 * it's our interactive learning activities, stimulating play areas, or nutritious meals,
 * we strive to create an engaging and supportive atmosphere where every child can flourish.
 *
 * We understand that choosing the right child care provider is a significant decision for
 * your family, and we're honored that you're considering MogiKids. Feel free to reach out
 * to us with any questions or to schedule a tour of our facilities. We look forward to
 * welcoming you and your child to the MogiKids family!
 *
 * Best regards,
 * The MogiKids Team
 */
