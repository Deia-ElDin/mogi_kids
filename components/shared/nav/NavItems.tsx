import Link from "next/link";
import { Button } from "@/components/ui/button";
import { headerLinks } from "@/constants";
import { usePathname } from "next/navigation";

const NavItems = (display: string) => {
  const pathname = usePathname();
  const navClass =
    display === "desktop"
      ? "hidden md:flex md:justify-between gap-auto ml-auto xl:w-[50%] lg:w-[60%] md:w-[75%]"
      : "flex flex-col gap-6 mt-28 bg-white";

  return (
    <nav className={navClass}>
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
