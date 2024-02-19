import { auth } from "@clerk/nextjs";
import { getUserByUserId } from "@/lib/actions/user.actions";
import { getPageByPageName } from "@/lib/actions/page.actions";
import { Separator } from "@/components/ui/separator";
import Article from "@/components/shared/helpers/Article";
import ServicesSwiper from "@/components/shared/swiper/ServicesSwiper";
import ServiceForm from "@/components/shared/forms/ServiceForm";
import PageForm from "@/components/shared/forms/PageForm";

// const serviceImgs = [
//   {
//     title: "Emergency Child Care",
//     url: "/assets/images/s1.jpeg",
//     paragraph: "",
//   },
//   {
//     title: "Overnight Care",
//     url: "/assets/images/s2.jpeg",
//     paragraph: "",
//   },
//   {
//     title: "Event Child Care",
//     url: "/assets/images/s3.jpeg",
//     paragraph: "",
//   },
//   {
//     title: "Nursery & School Pickup & Drop Off",
//     url: "/assets/images/s4.jpeg",
//     paragraph: "",
//   },
//   {
//     title: "After-School Home Care",
//     url: "/assets/images/s5.jpeg",
//     paragraph: "",
//   },
//   {
//     title: "Mall Babysitting Care",
//     url: "/assets/images/s6.jpeg",
//     paragraph: "",
//   },
//   {
//     title: "Holiday Child Care",
//     url: "/assets/images/s7.jpeg",
//     paragraph: "",
//   },
// ];

const textArr = [
  "• Preschools and schools.",
  "• Organizing celebrations for local and international occasions.",
  "• Arranging events in alignment with school and nursery curriculum.",
  "• Planning external trips and festivals for schools and nurseries.",
  "• Providing qualified teachers to deliver modern courses for children, such as courses in investment and a comprehensive program accredited by the Ministry of Education. This program enables children to learn about savings and apply their knowledge through practical exercises. Additionally, we offer certified courses in artificial intelligence and more.",
  "• Organizing modern and distinctive birthday celebrations, either at home or at external venues.",
  "• Arranging graduation parties for various age groups. Organizing private family gatherings.",
  "• Catering to children's needs during corporate events and institutional celebrations.",
  "• Organizing public carnivals.",
  "• Weekly varied and refreshing activities.",
  "• Weekly recreational and educational outings.",
  "• Providing all the stationery needs for schools, nurseries, and institutions through a single application, offering the best prices and daily delivery.",
  "• Supplying all school and educational supplies for students of various ages, with the option to customize their own designs.",
];

const Services = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const user = await getUserByUserId(userId);
  const servicePage = await getPageByPageName("Services Page");
  const isAdmin = user?.role === "Admin";

  const pageTitle =
    servicePage?.pageTitle ?? (isAdmin ? "Services Page Title" : null);
  const pageContent =
    servicePage?.pageContent?.split("\n") ?? (isAdmin ? "Content" : null);

  return (
    <section className="section-style">
      <Article title={pageTitle} content={pageContent} />
      <ServicesSwiper services={servicePage?.services || []} />
      {isAdmin && <PageForm page={servicePage} pageName="Services Page" />}
      {isAdmin && servicePage && <ServiceForm service={null} />}
      {(servicePage || isAdmin) && <Separator />}
    </section>
  );
};

export default Services;

// Our Services
// • Preschools and schools.
// • Organizing celebrations for local and international occasions.
// • Arranging events in alignment with school and nursery curriculum.
// • Planning external trips and festivals for schools and nurseries.
// • Providing qualified teachers to deliver modern courses for children, such as courses in investment and a comprehensive program accredited by the Ministry of Education. This program enables children to learn about savings and apply their knowledge through practical exercises. Additionally, we offer certified courses in artificial intelligence and more.
// • Organizing modern and distinctive birthday celebrations, either at home or at external venues.
// • Arranging graduation parties for various age groups. Organizing private family gatherings.
// • Catering to children's needs during corporate events and institutional celebrations.
// • Organizing public carnivals.
// • Weekly varied and refreshing activities.
// • Weekly recreational and educational outings.
// • Providing all the stationery needs for schools, nurseries, and institutions through a single application, offering the best prices and daily delivery.
// • Supplying all school and educational supplies for students of various ages, with the option to customize their own designs.

/*
Providing qualified teachers to deliver modern courses for children, such as courses in investment and a comprehensive program accredited by the Ministry of Education. This program enables children to learn about savings and apply their knowledge through practical exercises. Additionally, we offer certified courses in artificial intelligence and more
*/
