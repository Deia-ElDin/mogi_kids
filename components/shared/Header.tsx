"use client";

import DesktopHeader from "./helpers/DesktopHeader";
import MobileHeader from "./helpers/MobileHeader";
import { UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <>
      <DesktopHeader />
      <MobileHeader />
    </>
  );
};

export default Header;
