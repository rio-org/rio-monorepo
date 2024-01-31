import { ApiErrorKind } from './typings';

export class ApiError extends Error {
  public kind: ApiErrorKind;

  constructor(kind: ApiErrorKind, message: string) {
    super(message);
    this.message = message;
    this.kind = kind;
    this.name = 'ApiError';
  }
}

export const getApiSurfaceError = (err: ApiError) => {
  const surfaceError = { code: err.kind, error: err.message };
  switch (err.kind) {
    case 'BAD_REQUEST':
      return { httpStatusCode: 400, surfaceError };
    case 'UNAUTHORIZED':
      return { httpStatusCode: 401, surfaceError };
    case 'METHOD_NOT_ALLOWED':
      return { httpStatusCode: 405, surfaceError };
    case 'TRANSACTION_ERROR':
      return { httpStatusCode: 422, surfaceError };
    case 'RETRY_LIMIT':
      return { httpStatusCode: 429, surfaceError };
    case 'FORBIDDEN':
      return { httpStatusCode: 403, surfaceError };
    case 'NOT_FOUND':
      return { httpStatusCode: 404, surfaceError };
    case 'CONFLICT' || 'P2002':
      return { httpStatusCode: 409, surfaceError };
    case 'LOCKED':
      return { httpStatusCode: 423, surfaceError };
    case 'TEAPOT':
      return { httpStatusCode: 418, surfaceError };
    case 'FAHRENHEIT':
      return { httpStatusCode: 451, surfaceError };
    default:
      console.error(
        `Standard 500 body returned to client. Internal Error Code: ${err.kind} | Internal Error Message: ${err.message}`
      );
      return {
        httpStatusCode: 500,
        surfaceError: {
          kind: 'INTERNAL_SERVER_ERROR',
          error: 'An unexpected error occurred'
        }
      };
  }
};
