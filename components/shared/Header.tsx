"use client";

import { useState, useEffect } from "react";
import { getLogo } from "@/lib/actions/logo.actions";
import { ILogo } from "@/lib/database/models/logo.model";
import DesktopHeader from "./helpers/DesktopHeader";
import MobileHeader from "./helpers/MobileHeader";

const Header = () => {
  const [logo, setLogo] = useState<ILogo | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      setLogo(await getLogo());
    };

    fetchLogo();
  }, []);

  return (
    <>
      <DesktopHeader logo={logo} />
      <MobileHeader logo={logo} />
    </>
  );
};

export default Header;
