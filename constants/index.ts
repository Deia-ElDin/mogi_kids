import { IPage } from "@/lib/database/models/page.model";

export const logoImg = "/assets/images/logo.png";

export const headerLinks = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "About Us",
    route: "/about-us",
  },
  {
    label: "Services",
    route: "/services",
  },
  {
    label: "Careers",
    route: "/careers",
  },
  {
    label: "Contact Us",
    route: "/contact-us",
  },
];

// w: 1024, h: 768, aspect ratio: 4.3

export const socialMediaSvgs = [
  {
    label: "facebook",
    location: "/assets/icons/facebook.svg",
    url: "https://facebook.com",
  },
  {
    label: "instagram",
    location: "/assets/icons/instagram.svg",
    url: "https://instagram.com",
  },
  {
    label: "whatsapp",
    location: "/assets/icons/whatsapp.svg",
    url: "https://whatsapp.com",
  },
];

export const userWelcomePageText = [
  "At Mogi Kids, we are committed to providing the best child care experience for you and your little ones. We strive to create a safe, nurturing, and stimulating environment where children can learn and grow.",
  "We greatly value your opinion and would love to hear about your experience with Mogi Kids. Your feedback helps us understand what we're doing well and where we can improve to better serve you and your family.",
  "Would you take a moment to share your thoughts by writing a review? Whether it's a story about your child's progress, a positive experience with our staff, or suggestions for how we can enhance our services, your input is invaluable to us.",
  "To leave a review, simply click on the button below:",
];

export const questionsList = [
  {
    question: "What is MOGi KiDS Child Care Services?",
    answer:
      "MOGi KiDS Child Care Services provides qualified, competitive, dependable and professional care for your child. We are a group of child care professionals located in Abu Dhabi. We are a thriving company which delivers care through our unique MOGi KiDS mobile application. MOGi KiDS Child Care Services provides instant relief to parents who are facing care difficulties by allowing them to search for and book child care services, including in home child care, hotel child care, event child care, emergency child care, overnight care, travel companions, after-school home child care, nursery and school pick-up and drop-off, holiday child care, event baby sitting, hotel baby sitting, and mall baby sitting.",
  },
  {
    question:
      "How can MOGi KiDS Child Care Services Provider guarantee the safety of my child?",
    answer:
      "Your child’s safety is our top priority. We fully understand that it is difficult to choose the right caregiver, who will be fully able to meet the unique needs of your child. MOGi KiDS Child Care Services has meticulously screened and carried out background checks on all caregivers to ensure the safety of your child, your family, and the company. We contact all the known placement agencies so that we can provide caregivers who are more than qualified. Our MOGi KiDS include professional, certified, and licensed caregivers from different professions, including teachers and nurses with vast child caregiving experience. We also encourage our caregivers to take our Caregiving Online Training Program, before they start taking on caregiving work for MOGi KiDS Company.",
  },
  {
    question:
      "Why should I choose MOGi KiDS Child Care Services over other child care providers?",
    answer:
      "We are unique in how we deliver your child care and development needs. Using our mobile app, everything is just a click away. You can see what your child is doing with their caregiver through regular updates and photographs, plus GPS tracking when we are out and about with them. This provides you with peace of mind about their whereabouts and activities./n Most importantly, our caregivers have passion, care and love for children. They are all fully qualified to care for your child and they also really enjoy what they do.\n-SAFETY – You are protected by all the mandatory safeguarding requirements\n-IMMEDIATE – You can book an ‘on demand’ service anytime\n-TRACK- You can track your child and see their activities through our mobile app\n-TRUST- You can safely trust us to look after your child and keep them safe\n-ENGAGE- You can engage with us anytime and anywhere to ensure your child care needs are met\n-RESPONSE- You will always get a reply within 12 hours from us\n-SERVICE- We provide a quality service for your child",
  },
  {
    question: "What is the minimum duration, I can hire for a caregiver?",
    answer:
      "MOGi KiDS Child Care Services charges an hourly rate. The minimum time for our caregivers is four (4) hours, and the maximum is 12 hours.",
  },
  {
    question: "When and how can I request a caregiver?",
    answer:
      "You can request a caregiver or baby sitting by booking through our website or mobile app. You can book 24 hours, 7 days a week via our website, mobile application or you can call us on 02 000 0000 or 050 000 0000.",
  },
  {
    question:
      "I booked a care service but I am not sure if the payment went through. What should I do?",
    answer:
      "You will always get an email notification of booking and successful payment. If you do not receive the confirmation email within 1 hour, please contact us on 02 000 0000 or 050 000 0000.",
  },
  {
    question: "How can I lodge a complaint or give feedback?",
    answer:
      "We value your feedback, because it helps us to improve our services. Please get in touch with us at 02 000 0000 or 050 000 0000 to provide your feedback or email us at info@mogikids.ae.",
  },
];

export const aboutUsDetails = [
  {
    src: "/assets/images/about-us1.png",
    title: "Our Slogan",
    paragraph:
      "A healthy childhood for a healthy future and a better society. We have always believed that caring for children is one of the most important ways to create a good and healthy society. The majority of normal, moderate individuals often owe their well-being to their proper upbringing and childhood experiences, and vice versa. Some negative traits in a person may usually be rooted in their early experiences, escalating into a psychological problem that imposes itself on society and the individual alike.",
  },
  {
    src: "/assets/images/about-us2.png",
    title: "Our Goal",
    paragraph:
      "Our goal: To assist all our children in shaping their unique identities by discovering and nurturing their skills. We aim to ensure that they enjoy these discoveries, enabling them to live a future full of successes, keeping pace with development, with a strong mindset capable of innovation and individuality.",
  },
  {
    src: "/assets/images/about-us3.png",
    title: "Our Mission",
    paragraph:
      "To discover each child individually, providing them with their own space for expression, encouraging them to think, welcoming positive and healthy behaviors, and equipping them with the information and activities they need to build the best possible personality.",
  },
  {
    src: "/assets/images/about-us4.jpeg",
    title: "Our Vision & Target",
    paragraph:
      "We aim to reach all children in the current state and the future Arab Gulf region through schools, nurseries, and both governmental and private institutions. Every place where a child or their guardian is present is a target for us. We strive for the widespread availability of our services, benefiting everyone in need, and highlighting their importance everywhere.",
  },
];

export const logoDefaultValues = {
  imgUrl: "",
};

export const galleryDefaultValues = {
  imgUrl: "",
};

export const quoteDefaultValues = {
  cstName: "Mohamed",
  mobile: "0507890072",
  location: "Abu Dhabi",
  email: "deia.tech2021@gmail.com",
  numberOfHours: "5",
  numberOfKids: "3",
  ageOfKidsFrom: "3",
  ageOfKidsTo: "10",
  from: new Date(),
  to: new Date(),
  extraInfo: "what is the extra info?",
};

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, consequat nibh. Etiam non elit dui. Nulla nec purus feugiat, molestie ipsum et, consequat nibh. Etiam non elit dui.";

export const careerDefaultValues = {
  fullName: "sara",
  email: "deia.tech2021@gmail.com",
  mobile: "0507890072",
  applyingFor: "job 1",
  workingAt: "company 1",
  previousSalary: "2000",
  expectedSalary: "5000",
  joinDate: new Date(),
  gender: "Female",
  education: "Other",
  dhaCertificate: "Yes",
  careGiverCertificate: "Yes",
  experienceInUAE: [lorem, lorem, lorem, lorem, lorem],
  visa: "No",
  visaExpireDate: new Date(),
  coverLetter: lorem,
  imgUrl: "",
};

// export const careerDefaultValues = {
//   fullName: "",
//   email: "",
//   mobile: "",
//   applyingFor: "",
//   workingAt: "",
//   previousSalary: "",
//   expectedSalary: "",
//   joinDate: new Date(),
//   gender: "",
//   education: "",
//   dhaCertificate: "",
//   careGiverCertificate: "",
//   experienceInUAE: ["", "", "", "", ""],
//   visa: "",
//   visaExpireDate: new Date(),
//   coverLetter: "",
//   imgUrl: "",
// };

export const pageDefaultValues: Partial<IPage> = {
  pageName: "",
  pageTitle: "",
  pageContent: "",
};

export const serviceDefaultValues = {
  serviceName: "",
  imgUrl: "",
  serviceContent: "",
};

export const questionDefaultValues = {
  question: "",
  answer: "",
};

export const recordDefaultValues = {
  imgUrl: "",
  value: "",
  label: "",
};

export const reviewDefaultValues = {
  review: "",
  rating: "",
};

export const commentDefaultValues = {
  comment: "",
};

export const contactDefaultValues = {
  imgUrl: "",
  content: "",
};

export const aboutUsDefaultValues = {
  title: "",
  content: "",
  imgUrl: "",
};

export enum QuoteSortKey {
  DAYS = "days",
  HOURS = "hours",
  KIDS = "kids",
  AGES = "ages",
  TOTAL_HOURS = "totalHours",
  DATE = "createdAt",
}

export enum ApplicationsSortKey {
  GENDER = "gender",
  DHA = "dha",
  CGC = "cgc",
  SALARY = "salary",
  VISA_EXPIRY_DATE = "visa expiry date",
  JOIN_DATE = "joining date",
  DAYS = "days",
  DATE = "createdAt",
}
