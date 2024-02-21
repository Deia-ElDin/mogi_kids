"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { headerLinks } from "@/constants";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const IPadHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="md:hidden flex flex-col py-1 px-8 sticky top-0 bg-white border-b-4 border-custom-red z-20">
      <div className="flex justify-between items-center">
        <Image
          src="/assets/images/logo.png"
          alt="Logo"
          width={150}
          height={70}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />

        <div className="flex flex-col justify-center gap-3 items-center">
          <Image
            src={`/assets/icons/${isOpen ? "menu-on" : "menu"}.svg`}
            alt="Menu"
            width={30}
            height={30}
            className="cursor-pointer"
            onClick={() => setIsOpen((prev) => !prev)}
          />
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <Image
                src="/assets/3d/user.gif"
                alt="Girl"
                width={50}
                height={50}
                className="cursor-pointer min-h-[50px] min-w-[50px]"
              />
            </Link>
          </SignedOut>
        </div>
      </div>
      {isOpen && (
        <nav className="flex flex-col items-center gap-6 transition duration-600 ease-out">
          {headerLinks.map((link) => (
            <Button
              asChild
              key={link.label}
              className={`btn ${pathname === link.route && "active-btn w-fit"}`}
              onClick={() => setIsOpen(false)}
            >
              <Link href={link.route}>{link.label}</Link>
            </Button>
          ))}
        </nav>
      )}
    </header>
  );
};

export default IPadHeader;