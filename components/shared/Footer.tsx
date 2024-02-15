import Image from "next/image";
import Link from "next/link";
import { socialMediaSvgs } from "@/constants";
import DesktopFooter from "./helpers/DesktopFooter";
import MobileFooter from "./helpers/MobileFooter";

const Footer = () => {
  return (
    <>
      <DesktopFooter />
      <MobileFooter />
    </>
  );
};

export default Footer;
