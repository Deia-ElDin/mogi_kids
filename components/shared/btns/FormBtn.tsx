import { Button } from "@/components/ui/button";

type SubmitBtnProps = {
  text: string;
  isSubmitting: boolean;
};

const SubmitBtn = ({ isSubmitting }: { isSubmitting: boolean }) => {
  const divsText = "Submitting";

  return (
    <button
      id="inTurnBlurringTextG"
      className="bg-white form-btn label-style w-full flex justify-center items-center text-white h-10"
      disabled={isSubmitting}
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

const TextBtn = ({ text, isSubmitting }: SubmitBtnProps) => (
  <Button
    type="submit"
    className="form-btn label-style w-full"
    disabled={isSubmitting}
  >
    {text}
  </Button>
);

const FormBtn: React.FC<SubmitBtnProps> = ({ text, isSubmitting }) => {
  return isSubmitting ? (
    <SubmitBtn isSubmitting={isSubmitting} />
  ) : (
    <TextBtn text={text} isSubmitting={isSubmitting} />
  );
};

export default FormBtn;
