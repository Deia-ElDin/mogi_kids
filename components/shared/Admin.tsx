import LogoForm from "./forms/LogoForm";
import GalleryForm from "./forms/GalleryForm";
import AdminPanel from "./AdminPanel";
import { ILogo } from "@/lib/database/models/logo.model";
import { IGallery } from "@/lib/database/models/gallery.model";

type AdminProps = {
  isAdmin: boolean;
  logo: ILogo | null;
  gallery: IGallery[] | [];
  uploadthingDb: string;
};

const Admin: React.FC<AdminProps> = async (props) => {
  const { isAdmin, logo, gallery, uploadthingDb } = props;

  if (!isAdmin) return;

  return (
    <section className="section-style relative gap-1">
      <AdminPanel uploadthingDb={uploadthingDb} />
      <LogoForm logo={logo} />
      <GalleryForm gallery={gallery} />
    </section>
  );
};

export default Admin;
