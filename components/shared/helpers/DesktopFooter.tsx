import Link from "next/link";
import Image from "next/image";
import { socialMediaSvgs } from "@/constants";

const DesktopFooter = () => {
  return (
    <footer className="hidden sm:flex sm:flex-col items-center relative">
      <div>
        <Link href="/" className="absolute left-10 bottom-14">
          <Image
            src="/assets/images/logo.png"
            alt="Logo"
            width={128}
            height={38}
          />
        </Link>
        <div className="flex flex-col justify-center items-center gap-4 h-28">
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
      </div>
      <div className="flex justify-center bg-gray-400 w-full">
        <p className="text-white p-2">
          Copyright &copy; {`${new Date().getFullYear()} `} Mogi Kids. All
          Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default DesktopFooter;
