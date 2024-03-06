import { ILogo } from "@/lib/database/models/logo.model";
import { IGallery } from "@/lib/database/models/gallery.model";
import { IQuote } from "@/lib/database/models/quote.model";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogoForm from "./forms/LogoForm";
import GalleryForm from "./forms/GalleryForm";
import DataBases from "./DataBases";

type AdminProps = {
  isAdmin: boolean;
  logo: ILogo | null;
  gallery: IGallery[] | [];
  resend: number;
  uploadthingDb: string;
};

const Admin: React.FC<AdminProps> = async (props) => {
  const { isAdmin, logo, gallery, resend, uploadthingDb } = props;

  if (!isAdmin) return;

  return (
    <section className="section-style relative gap-1">
      <DataBases uploadthingDb={uploadthingDb} resend={resend} />
      <LogoForm logo={logo} />
      <GalleryForm gallery={gallery} />
    </section>
  );
};

export default Admin;
