type AdminProps = {
  isAdmin: boolean;
};

const Admin = async (props: AdminProps) => {
  const { isAdmin } = props;

  if (!isAdmin) return;
  return <section className="section-style relative"></section>;
};

export default Admin;
