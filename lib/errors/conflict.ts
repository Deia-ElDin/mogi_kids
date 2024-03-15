import CustomApiError from "./customApiError";

class ConflictError extends CustomApiError {
  statusCode: number;

  constructor(message: string) {
    super(message, 409);
    this.statusCode = 409;
  }
}

export default ConflictError;
