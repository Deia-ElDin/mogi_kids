"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { getLogo } from "@/lib/actions/logo.actions";
import { handleError } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { usePathname } from "next/navigation";
import { IUser } from "@/lib/database/models/user.model";
import { ILogo } from "@/lib/database/models/logo.model";
import { getUserByClerkId } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import { useToast } from "../ui/use-toast";
import { logoImg, headerLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<IUser | null>(null);
  const [logo, setLogo] = useState<ILogo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const logoResult = await getLogo();
        setLogo(logoResult.success ? logoResult.data || null : null);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: handleError(error),
        });
      }
    };

    fetchLogo();

    const handleResize = () => setIsOpen(false);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (clerkUser) {
        const userResult = await getUserByClerkId(clerkUser.id);
        setUser(userResult.success ? userResult.data || null : null);
      }
    };

    if (!clerkUser && user?._id) setUser(null);

    fetchUser();
  }, [clerkUser]);

  return (
    <>
      <header className="hidden lg:flex lg:justify-between lg:items-center py-1 px-8 sticky top-0 bg-white border-b-4 border-red-500 z-30">
        <div className="w-fit">
          <Link href="/">
            <img
              src={logo?.imgUrl || logoImg}
              alt="Logo"
              className="cursor-pointer w-[160px] h-100%"
            />
          </Link>
        </div>
        <nav className="flex justify-between items-center gap-auto ml-auto xl:w-[60%] lg:w-[75%]">
          {headerLinks.map((link) => (
            <Button
              asChild
              key={link.label}
              className={`btn ${pathname === link.route && "active-btn "}`}
            >
              <Link href={link.route}>{link.label}</Link>
            </Button>
          ))}
          {user && (
            <Button
              asChild
              className={`btn ${
                pathname === `/users/${user._id}` ? "active-btn" : ""
              }`}
            >
              <Link href={`/users/${user._id}`}>
                {user.firstName.length < 15 ? user.firstName : "Hi"}
              </Link>
            </Button>
          )}
          <div className="flex justify-center items-center">
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
        </nav>
      </header>
      <header className="lg:hidden flex flex-col py-1 px-8 sticky top-0 bg-white border-b-4 border-custom-red z-30">
        <div className="flex justify-between items-center">
          <Link href="/">
            <img
              src={logo?.imgUrl || "/assets/images/logo.png"}
              alt="Logo"
              className="cursor-pointer w-[160px] h-100%"
            />
          </Link>
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
                className={`btn ${
                  pathname === link.route && "active-btn w-fit"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Link href={link.route}>{link.label}</Link>
              </Button>
            ))}
            {user && (
              <Button
                asChild
                className={`btn ${
                  pathname === `/users/${user._id}` ? "active-btn" : ""
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Link href={`/users/${user._id}`}>
                  {user.firstName.length < 15 ? user.firstName : "Hi"}
                </Link>
              </Button>
            )}
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
