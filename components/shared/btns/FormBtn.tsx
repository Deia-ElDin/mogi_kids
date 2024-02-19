import { Button } from "@/components/ui/button";

type Props = {
  text: string;
  isSubmitting: boolean;
};

const SubmitBtn = () => {
  const divsText = "Submitting";

  return (
    <button
      id="inTurnBlurringTextG"
      className="bg-white form-btn label-style w-full flex justify-center items-center text-white h-10"
    >
      {divsText.split("").map((letter, index) => (
        <div
          key={index}
          id={`inTurnBlurringTextG_${index + 1}`}
          className="inTurnBlurringTextG"
        >
          {letter}
        </div>
      ))}
    </button>
  );
};

const TextBtn = ({ text }: { text: string }) => (
  <Button type="submit" className="form-btn label-style">
    {text}
  </Button>
);

const FormBtn: React.FC<Props> = ({ text, isSubmitting }) => {
  return isSubmitting ? <SubmitBtn /> : <TextBtn text={text} />;
};

export default FormBtn;
