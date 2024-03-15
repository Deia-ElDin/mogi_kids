import CustomApiError from "./customApiError";

class UnauthorizedError extends CustomApiError {
  statusCode: number;

  constructor(message: string) {
    super(message, 401);
    this.statusCode = 401;
  }
}

export default UnauthorizedError;
