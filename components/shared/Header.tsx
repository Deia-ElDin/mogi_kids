"use client";

import Image from "next/image";
import Link from "next/link";
import { headerLinks } from "@/constants";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="flex items-center">
      <div className="w-[25%]">
        <Image
          src="/assets/images/logo.png"
          alt="Logo"
          width={128}
          height={38}
          className="cursor-pointer"
        />
      </div>
      <div className="w-[75%] flex justify-between gap-2 py-8 pr-8">
        {headerLinks.map((link) => (
          <Button
            asChild
            key={link.label}
            className={`btn ${pathname === link.route && "active-btn"}`}
          >
            <Link href={link.route} className="sm:txt-sm md:txt-md xl:txt-xl">
              {link.label}
            </Link>
          </Button>
        ))}
      </div>
    </header>
  );
};

export default Header;
