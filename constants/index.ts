import { IPage } from "@/lib/database/models/page.model";

// w: 1024, h: 768, aspect ratio: 4.3

export const minMaxValues = {
  logoImg: { minLength: 1 },
  galleryImg: { minLength: 1 },
  webPage: {
    title: { minLength: 1 },
  },
  services: {
    name: { minLength: 1 },
    img: { minLength: 1 },
    content: { minLength: 1 },
  },
  questions: {
    question: { minLength: 1 },
    answer: { minLength: 1 },
  },
  records: {
    img: { minLength: 1 },
    value: { minLength: 1 },
    label: { minLength: 1 },
  },
  reviews: {
    review: { minLength: 1, maxLength: 1500 },
    rating: { minLength: 1, maxLength: 1, minValue: 1, maxValue: 5 },
  },
  comments: {
    comment: { minLength: 1, maxLength: 1000 },
  },
  quotation: {
    name: { minLength: 1, maxLength: 100 },
    mobile: { minLength: 1, maxLength: 14 },
    location: { minLength: 1, maxLength: 14 },
    email: { minLength: 1, maxLength: 100 },
    hours: { minLength: 1, maxLength: 2, minValue: 1, maxValue: 24 },
    kids: { minLength: 1, maxLength: 4, minValue: 1, maxValue: 2000 },
    age: { minLength: 1, maxLength: 2, minValue: 1, maxValue: 15 },
    date: { minLength: 1, maxLength: 10, maxValue: 15 },
    extraInfo: { maxLength: 5000 },
  },
  contacts: {
    imgUrl: { minLength: 1 },
    content: { minLength: 1 },
  },
  aboutUs: {
    title: { minLength: 1 },
    content: { minLength: 1 },
    imgUrl: { minLength: 1 },
  },
  career: {
    fullName: { minLength: 1, maxLength: 100 },
    email: { minLength: 1, maxLength: 100 },
    mobile: { minLength: 1, maxLength: 14 },
    workingAt: { maxLength: 250 },
    applyingFor: { minLength: 1, maxLength: 250 },
    joinDate: { minLength: 1, maxLength: 10, maxValue: 2 },
    salary: { maxLength: 25 },
    gender: { minLength: 4, maxLength: 6 },
    education: { minLength: 5, maxLength: 8 },
    dha: { minLength: 2, maxLength: 3 },
    cgc: { minLength: 2, maxLength: 3 },
    visa: { minLength: 2, maxLength: 3 },
    visExpiryDate: { minLength: 1, maxLength: 10, maxValue: 10 },
    coverLetter: { maxLength: 5000 },
    imgUrl: { minLength: 1 },
  },
};

export const today = new Date();

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

export const webPagesArr = [
  "Welcomes Page",
  "Services Page",
  "Questions Page",
  "Records Page",
  "Customers Page",
  "Quote Page",
  "Contacts Page",
  "Careers Page",
];

export const quoteLocationsArr = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

export const gendersArr = ["Female", "Male"];

export const educationsArr = ["Bachelor", "Diploma", "Other"];

export const yesNoArr = ["Yes", "No"];

// Logo
export const logoDefaultValues = {
  imgUrl: "",
};

// Gallery
export const galleryDefaultValues = {
  imgUrl: "",
};

// Quotations
export const quoteDefaultValues = {
  cstName: "",
  mobile: "",
  location: "",
  email: "",
  numberOfHours: "",
  numberOfKids: "",
  ageOfKidsFrom: "",
  ageOfKidsTo: "",
  from: new Date(),
  to: new Date(),
  extraInfo: "",
};

// Career
export const careerDefaultValues = {
  fullName: "deia",
  email: "deia.tech2021@gmail.com",
  mobile: "0507890072",
  applyingFor: "whatever",
  workingAt: "xyz",
  previousSalary: "2000",
  expectedSalary: "3000",
  joinDate: new Date(),
  gender: "Female",
  education: "Other",
  dhaCertificate: "Yes",
  careGiverCertificate: "Yes",
  experienceInUAE: ["111", "222", "333", "444", ""],
  visa: "Yes",
  visaExpireDate: new Date(),
  coverLetter: "",
  imgUrl: "",
};

// Web Pages
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
