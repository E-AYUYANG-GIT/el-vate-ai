// A known, expected error we want to surface to the client with a
// specific code and friendly message (as opposed to an unexpected
// crash, which the error handler turns into a generic INTERNAL_ERROR).
export class AppError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}
