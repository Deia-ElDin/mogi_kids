import { auth } from "@clerk/nextjs";
import { getUser } from "@/lib/actions/user.actions";
import { getWelcomePage } from "@/lib/actions/welcome.actions";
import { Separator } from "../ui/separator";
import Article from "./Article";
import WelcomeForm from "./forms/WelcomeForm";

const Welcome = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const user = await getUser(userId);
  const isAdmin = user?.role === "Admin";
  const welcomePage = await getWelcomePage();

  return (
    <section className="section-style relative">
      <Article
        page={welcomePage}
        title={welcomePage.title}
        content={welcomePage?.content?.split("\n")}
      />
      <WelcomeForm isAdmin={isAdmin} welcomePage={welcomePage} />
      <Separator />
    </section>
  );
};

export default Welcome;

{
  /* 
Welcome To MOGi KiDS Company – Home To The Finest Child Care Specialists In The UAE!

At MOGi KiDS, we firmly believe that every child is unique and talented, deserving the opportunity to discover their individuality and develop their skills for a successful and joyous future. We are dedicated to paving the way for children through distinctive and innovative entertainment, educational programs, and studies, all delivered in an environment characterized by safety, fun, and stimulation.

The concept originated in 2019 and underwent extensive testing with parents to ensure continuous improvement and quality. As of the latest country statistics, there are approximately 1,145 schools, consisting of 838 private and government nurseries. The United Arab Emirates recorded an average of 35,552 nurseries in the year 2014, aligning with our slogan: 'A healthy childhood for a healthy future and a better society.'

We firmly believe that nurturing children is paramount to fostering a good and healthy society. A majority of well-adjusted individuals contribute positively to society due to their proper upbringing and childhood experiences. Conversely, negative traits in a person may often be attributed to their early experiences, potentially escalating into psychological problems that impact both the individual and society. Our mission is to provide a foundation that corrects and mitigates any potential negative impact from these early experiences.

<Title text="Welcome To MOGi KiDS Company – Home To The Finest Child Care Specialists In The UAE!" />
<Text text="At MOGi KiDS, we firmly believe that every child is unique and talented, deserving the opportunity to discover their individuality and develop their skills for a successful and joyous future. We are dedicated to paving the way for children through distinctive and innovative entertainment, educational programs, and studies, all delivered in an environment characterized by safety, fun, and stimulation." />
<Text text="The concept originated in 2019 and underwent extensive testing with parents to ensure continuous improvement and quality. As of the latest country statistics, there are approximately 1,145 schools, consisting of 838 private and government nurseries. The United Arab Emirates recorded an average of 35,552 nurseries in the year 2014, aligning with our slogan: 'A healthy childhood for a healthy future and a better society.'" />
<Text text="We firmly believe that nurturing children is paramount to fostering a good and healthy society. A majority of well-adjusted individuals contribute positively to society due to their proper upbringing and childhood experiences. Conversely, negative traits in a person may often be attributed to their early experiences, potentially escalating into psychological problems that impact both the individual and society. Our mission is to provide a foundation that corrects and mitigates any potential negative impact from these early experiences." /> */
}
