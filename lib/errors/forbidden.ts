import CustomApiError from "./customApiError";

class ForbiddenError extends CustomApiError {
  statusCode: number;

  constructor(message: string) {
    super(message, 403);
    this.statusCode = 403;
  }
}

export default ForbiddenError;
