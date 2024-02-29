import Link from "next/link";
import Image from "next/image";
import { socialMediaSvgs } from "@/constants";
import { ILogo } from "@/lib/database/models/logo.model";
import { logoImg } from "@/constants";

const MobileFooter = ({ logo }: { logo: ILogo | null }) => {
  return (
    <footer className="sm:hidden flex flex-col gap-5 items-center">
      <Link href="/" className="w-full">
        <img
          src={logo?.imgUrl || logoImg}
          alt="Logo"
          className="cursor-pointer w-full h-full"
        />
      </Link>
      <div className="flex flex-col justify-center items-center gap-4">
        <p className="font-bold">FOLLOW US:</p>
        <div className="flex items-center gap-6">
          {socialMediaSvgs.map((media) => (
            <Link key={media.label} href={media.url}>
              <Image
                src={media.location}
                alt={media.label}
                width={40}
                height={40}
                className="hover:w-8 hover:h-8 transition-all duration-300 ease-in-out"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-center bg-gray-400 w-full">
        <p className="text-white p-2">
          Copyright &copy; {`${new Date().getFullYear()} `} MOGi KiDS. All
          Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default MobileFooter;
