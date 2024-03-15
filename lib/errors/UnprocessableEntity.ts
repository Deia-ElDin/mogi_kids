import CustomApiError from "./customApiError";

class UnprocessableEntity extends CustomApiError {
  statusCode: number;

  constructor(message: string) {
    super(message, 422);
    this.statusCode = 422;
  }
}

export default UnprocessableEntity;
