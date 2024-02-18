import { Button } from "@/components/ui/button";

type Props = {
  text: string;
  isSubmitting: boolean;
};

const FormBtn: React.FC<Props> = ({ text, isSubmitting }) => {
  return isSubmitting ? (
    <button
      id="inTurnBlurringTextG"
      className="bg-white form-btn label-style w-full flex justify-center items-center text-white h-10"
    >
      <div id="inTurnBlurringTextG_1" className="inTurnBlurringTextG">
        S
      </div>
      <div id="inTurnBlurringTextG_2" className="inTurnBlurringTextG">
        u
      </div>
      <div id="inTurnBlurringTextG_3" className="inTurnBlurringTextG">
        b
      </div>
      <div id="inTurnBlurringTextG_4" className="inTurnBlurringTextG">
        m
      </div>
      <div id="inTurnBlurringTextG_5" className="inTurnBlurringTextG">
        i
      </div>
      <div id="inTurnBlurringTextG_6" className="inTurnBlurringTextG">
        t
      </div>
      <div id="inTurnBlurringTextG_7" className="inTurnBlurringTextG">
        t
      </div>
      <div id="inTurnBlurringTextG_8" className="inTurnBlurringTextG">
        i
      </div>
      <div id="inTurnBlurringTextG_9" className="inTurnBlurringTextG">
        n
      </div>
      <div id="inTurnBlurringTextG_10" className="inTurnBlurringTextG">
        g
      </div>
    </button>
  ) : (
    <Button type="submit" className="form-btn label-style">
      {text}
    </Button>
  );
};

export default FormBtn;
