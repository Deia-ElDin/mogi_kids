import { auth } from "@clerk/nextjs";
import { getUser } from "@/lib/actions/user.actions";
import { getServicePage } from "@/lib/actions/service.action";
import { Separator } from "@/components/ui/separator";
import Article from "@/components/shared/Article";
import ServicesSwiper from "@/components/shared/swiper/ServicesSwiper";
import ServiceForm from "@/components/shared/forms/ServiceForm";
import AddServiceForm from "@/components/shared/forms/AddServiceForm";

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
  const user = await getUser(userId);
  const isAdmin = user?.role === "Admin";
  const servicePage = await getServicePage();

  return (
    <section id="services" className="section-style">
      <Article
        page={servicePage}
        title={servicePage.title}
        content={servicePage?.content?.split("\n")}
      />
      {/* <ServicesSwiper serviceImgs={serviceImgs} /> */}
      <ServiceForm isAdmin={isAdmin} servicePage={null} />
      <AddServiceForm isAdmin={isAdmin} servicePage={null} />
      <Separator />
    </section>
  );
};

export default Services;

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
