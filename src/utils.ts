export class HttpError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.code = code;
    this.status = status;

    Error.captureStackTrace(this);
  }
}
