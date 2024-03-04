import { IUser } from "@/lib/database/models/user.model";
import { getAllQuotes } from "@/lib/actions/quote.actions";
import AdminQuotes from "../AdminQuotes";

type UserRouteType = {
  user: IUser;
};

const AdminRoute: React.FC<UserRouteType> = async ({ user }) => {
  const quotesResult = await getAllQuotes();

  const quotes = quotesResult.success ? quotesResult.data || [] : [];

  console.log("quotes.length", quotes.length);
  console.log("quotes[0]", quotes[0]);

  return (
    <section className="section-style">
      <AdminQuotes quotes={quotes} />
    </section>
  );
};

export default AdminRoute;
