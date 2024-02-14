"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { headerLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";

const navItems = (pathname: string) => {
  return (
    <div className="flex flex-col gap-6 mt-28 bg-white">
      {headerLinks.map((link) => (
        <Button
          asChild
          key={link.label}
          className={`btn ${pathname === link.route && "active-btn "}`}
        >
          <Link href={link.route}>{link.label}</Link>
        </Button>
      ))}
    </div>
  );
};

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="md:hidden ml-auto">
      <Sheet>
        <Image
          src="/assets/icons/menu.svg"
          alt="menu"
          width={24}
          height={24}
          className="cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        />
        {/* {isOpen && (
       
        )} */}

        {/* <Separator className="border border-gray-50" /> */}
      </Sheet>
    </nav>
  );
};

// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuIndicator,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
//   NavigationMenuViewport,
// } from "@/components/ui/navigation-menu";

// const MobileNav = () => {
//   return (
//     <NavigationMenu>
//       <NavigationMenuList>
//         <NavigationMenuItem>
//           <NavigationMenuTrigger className="">
//             <Image
//               src="/assets/icons/menu.svg"
//               alt="menu"
//               width={24}
//               height={24}
//               className="cursor-pointer"
//             />
//           </NavigationMenuTrigger>
//           <NavigationMenuContent>
//             <NavigationMenuLink>Link</NavigationMenuLink>
//           </NavigationMenuContent>
//         </NavigationMenuItem>
//       </NavigationMenuList>
//     </NavigationMenu>
//   );
// };

export default MobileNav;
