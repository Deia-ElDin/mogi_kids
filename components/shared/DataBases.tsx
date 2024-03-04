import DBCard from "./cards/DbCard";

type AdminProps = {
  uploadthingDb: string;
  resend: number;
};

const DataBases: React.FC<AdminProps> = ({ uploadthingDb, resend }) => {
  return (
    <div className="flex flex-wrap justify-center md:justify-between gap-5 mb-3">
      <DBCard
        link="https://uploadthing.com/"
        src="/assets/images/uploadthing.png"
        alt="Uploadthing image"
        text="Uploadthing"
        value={uploadthingDb}
        base="2 GB"
      />
      <DBCard
        link="https://resend.com/"
        src="/assets/images/resend.webp"
        alt="Resend image"
        text="Resend"
        value={String(resend)}
        base="100 Email"
      />
    </div>
  );
};

export default DataBases;
