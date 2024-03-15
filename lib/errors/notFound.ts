import CustomApiError from "./customApiError";

class NotFoundError extends CustomApiError {
  statusCode: number;

  constructor(message: string) {
    super(message, 404);
    this.statusCode = 404;
  }
}

export default NotFoundError;
