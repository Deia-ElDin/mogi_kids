import LogoForm from "./forms/LogoForm";
import GalleryForm from "./forms/GalleryForm";
import DataBases from "./DataBases";
import { ILogo } from "@/lib/database/models/logo.model";
import { IGallery } from "@/lib/database/models/gallery.model";
import { IQuote } from "@/lib/database/models/quote.model";
import { totalEmailsSentToday } from "@/lib/utils";

type AdminProps = {
  isAdmin: boolean;
  logo: ILogo | null;
  gallery: IGallery[] | [];
  quotes: IQuote[] | [];
  uploadthingDb: string;
};

const Admin: React.FC<AdminProps> = async (props) => {
  const { isAdmin, logo, gallery, quotes, uploadthingDb } = props;

  if (!isAdmin) return;

  console.log("totalEmailsSentToday(quotes) = ", totalEmailsSentToday(quotes));

  return (
    <section className="section-style relative gap-1">
      <DataBases
        uploadthingDb={uploadthingDb}
        resend={totalEmailsSentToday(quotes)}
      />
      <LogoForm logo={logo} />
      <GalleryForm gallery={gallery} />
    </section>
  );
};

export default Admin;
