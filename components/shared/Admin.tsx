import LogoForm from "./forms/LogoForm";

import { ILogo } from "@/lib/database/models/logo.model";

type AdminProps = {
  isAdmin: boolean;
  logo: ILogo | null;
};

const Admin = async (props: AdminProps) => {
  const { isAdmin, logo } = props;

  if (!isAdmin) return;

  return (
    <section className="section-style relative">
      <LogoForm logo={logo} />
    </section>
  );
};

export default Admin;
