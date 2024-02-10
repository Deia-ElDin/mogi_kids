"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { headerLinks, careImgs } from "@/constants";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

const Header = () => {
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => (prevCount + 1) % careImgs.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header>
      <div className="flex justify-between items-center pb-5">
        <Image
          src="/assets/images/logo.png"
          alt="Logo"
          width={128}
          height={38}
          className="cursor-pointer"
        />
        {
          <div className="flex justify-between gap-2 w-fit">
            {headerLinks.map((link) => (
              <Button
                asChild
                key={link.label}
                className={`btn ${pathname === link.route && "active-btn"}`}
              >
                <Link href={link.route} className="text-lg font-normal">
                  {link.label}
                </Link>
              </Button>
            ))}
          </div>
        }
      </div>
      <img src={careImgs[count]} alt="Childcare" />
    </header>
  );
};

export default Header;
