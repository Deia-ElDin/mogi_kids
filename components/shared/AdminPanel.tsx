import DBCard from "./cards/DbCard";

type AdminProps = {
  uploadthingDb: string;
};

const AdminPanel: React.FC<AdminProps> = ({ uploadthingDb }) => {
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
        link="https://www.mongodb.com/"
        src="/assets/icons/mongodb.svg"
        alt="Mongodb image"
        text="MongoDb"
        value={uploadthingDb}
        base="512 MB"
      />
      <DBCard
        link="https://resend.com/"
        src="/assets/images/resend.webp"
        alt="Resend image"
        text="Resend"
        value="20"
        base="100 Email"
      />
    </div>
  );
};

export default AdminPanel;
