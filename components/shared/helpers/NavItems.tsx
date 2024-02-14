import { usePathname } from "next/navigation";
import { headerLinks } from "@/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NavItems = ({ display }: { display: string }) => {
  const pathname = usePathname();

  return (
    <nav
      className={
        display === "desktop"
          ? "hidden md:flex md:justify-between gap-auto ml-auto xl:w-[50%] lg:w-[60%] md:w-[75%]"
          : "flex flex-col gap-6 mt-28 bg-white md:hidden"
      }
    >
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

export default NavItems;
