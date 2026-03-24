export interface DetailedAPIErrorPayload {
  title?: string;
  detail?: string;
  status?: number;
  type?: string;
}

export class DetailedAPIError extends Error {
  title?: string;
  detail?: string;
  status?: number;
  type?: string;

  constructor(payload: DetailedAPIErrorPayload) {
    super(payload.detail);
    this.name = new.target.name;
    this.title = payload?.title;
    this.detail = payload?.detail;
    this.status = payload?.status;
    this.type = payload?.type;
  }
}

export class ServerTimeoutError extends Error { code = '504'; }
export class BadRequestError extends DetailedAPIError { code = '400'; }
export class UnauthorizedError extends DetailedAPIError { code = '401'; }
export class ForbiddenError extends DetailedAPIError { code = '403'; }
export class NotFoundError extends Error { code = '404'; }
export class InternalServerError extends Error { code = '500'; }
