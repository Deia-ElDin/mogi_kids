"use client";

import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { headerLinks } from "@/constants";
import { IUser } from "@/lib/database/models/user.model";
import { getUserByClerkId } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const MobileHeader = () => {
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<IUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setIsOpen(false);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (clerkUser) {
        const user = await getUserByClerkId(clerkUser.id);
        setUser(user);
      }
    };

    if (!clerkUser && user?._id) setUser(null);

    fetchUser();
  }, [clerkUser]);

  return (
    <header className="lg:hidden flex flex-col py-1 px-8 sticky top-0 bg-white border-b-4 border-custom-red z-20">
      <div className="flex justify-between items-center">
        <Image
          src="/assets/images/logo.png"
          alt="Logo"
          width={150}
          height={70}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />

        <div className="flex justify-center gap-3 items-center">
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
        <nav className="flex flex-col md:flex-row md:justify-center md:my-5 items-center gap-6 transition duration-600 ease-out">
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
          {user && (
            <Button asChild className="btn active-btn">
              <Link href={`/users/${user._id}`}>
                {user.firstName.length < 15 ? user.firstName : "Hi"}
              </Link>
            </Button>
          )}
        </nav>
      )}
    </header>
  );
};

export default MobileHeader;
