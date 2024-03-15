import CustomApiError from "./customApiError";

class BadRequestError extends CustomApiError {
  statusCode: number;

  constructor(message: string) {
    super(message, 400);
    this.statusCode = 400;
  }
}

export default BadRequestError;
