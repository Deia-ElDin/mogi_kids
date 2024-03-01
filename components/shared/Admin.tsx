import LogoForm from "./forms/LogoForm";
import GalleryForm from "./forms/GalleryForm";

import { ILogo } from "@/lib/database/models/logo.model";
import { IGallery } from "@/lib/database/models/gallery.model";

type AdminProps = {
  isAdmin: boolean;
  logo: ILogo | null;
  gallery: IGallery[] | [] | IGallery | null;
};

const Admin = async (props: AdminProps) => {
  const { isAdmin, logo, gallery } = props;

  if (!isAdmin) return;

  return (
    <section className="section-style relative gap-3">
      <LogoForm logo={logo} />
      <GalleryForm gallery={gallery} />
    </section>
  );
};

export default Admin;
