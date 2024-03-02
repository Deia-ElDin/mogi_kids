"use client";

import { useState, useEffect } from "react";
import { getLogo } from "@/lib/actions/logo.actions";
import { ILogo } from "@/lib/database/models/logo.model";
import { handleError } from "@/lib/utils";
import { logoImg, socialMediaSvgs } from "@/constants";
import { useToast } from "../ui/use-toast";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const [logo, setLogo] = useState<ILogo | null>(null);
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
  }, []);

  return (
    <>
      <footer className="hidden sm:flex sm:flex-col items-center relative">
        <div>
          <Link href="/" className="absolute left-10 bottom-14">
            <img
              src={logo?.imgUrl || logoImg}
              alt="Logo"
              className="cursor-pointer w-[160px] h-100%"
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
            Copyright &copy; {`${new Date().getFullYear()} `} MOGi KiDS. All
            Rights Reserved.
          </p>
        </div>
      </footer>
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
    </>
  );
};

export default Footer;
