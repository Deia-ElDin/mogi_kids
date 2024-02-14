"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { headerLinks } from "@/constants";
import Link from "next/link";

const DesktopNav = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex md:justify-between gap-auto ml-auto xl:w-[50%] lg:w-[60%] md:w-[75%]">
      {headerLinks.map((link) => (
        <Button
          asChild
          key={link.label}
          className={`btn ${pathname === link.route && "active-btn "}`}
        >
          <Link href={link.route}>{link.label}</Link>
        </Button>
      ))}
    </nav>
  );
};

export default DesktopNav;
