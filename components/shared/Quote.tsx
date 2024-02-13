import Title from "./helpers/Title"
import Body from "./helpers/Body"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { quoteSchema } from "@/lib/validators"

const Quote = () => {
  return (
    <section>
      <Title text = "Find Out More About Our Services Today!" />
      <Body text = "Are you ready to put your child in the care of one of our professional child care provider, and take advantage of convenient and customizable child care services?" />
      <Body text = "Get in touch with us now" />
    </section>
  )
}

export default Quote