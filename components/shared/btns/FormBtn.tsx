import { Button } from "@/components/ui/button";

type Props = {
  text: string;
};

const FormBtn: React.FC<Props> = ({ text }) => {
  return (
    <Button type="submit" className="form-btn label-style">
      {text}
    </Button>
  );
};

export default FormBtn;
