"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { headerLinks } from "@/constants";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

import DesktopNav from "./nav/DesktopNav";
import MobileNav from "./nav/MobileNav";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="flex items-center py-1 px-8 sticky top-0 bg-white border-b-4 border-red-500 z-20">
      <div className="w-[30%]">
        <Image
          src="/assets/images/logo.png"
          alt="Logo"
          width={180}
          height={70}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>
      <DesktopNav />
      <MobileNav />
    </header>
  );
};

export default Header;
