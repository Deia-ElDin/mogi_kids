"use client";

import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { headerLinks } from "@/constants";
import { IUser } from "@/lib/database/models/user.model";
import { getUserByClerkId } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const DesktopHeader = () => {
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<IUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (clerkUser) {
        const dbUser = await getUserByClerkId(clerkUser.id);
        setUser(dbUser);
      }
    };

    fetchUser();
  }, [clerkUser]);

  console.log("user", user);

  return (
    <header className="hidden lg:flex lg:justify-between lg:items-center py-1 px-8 sticky top-0 bg-white border-b-4 border-red-500 z-20">
      <div className="w-fit">
        <Image
          src="/assets/images/logo.png"
          alt="Logo"
          width={180}
          height={70}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
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
          <Button asChild className="btn active-btn">
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
  );
};

export default DesktopHeader;
