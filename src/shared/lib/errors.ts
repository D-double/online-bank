export type AppErrorCode =
  | 'cardNotFound'
  | 'cardBlocked'
  | 'insufficientFunds'
  | 'amountOutOfRange'
  | 'providerNotFound'
  | 'sameCard'
  | 'invalidCard'
  | 'duplicateCard'
  | 'wrongOtp';

export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(code: AppErrorCode) {
    super(code);
    this.name = 'AppError';
    this.code = code;
  }
}

/** Ключ перевода для ошибки, пригодный для `t()`. */
export const getErrorKey = (error: unknown): string =>
  error instanceof AppError ? `errors.${error.code}` : 'errors.unknown';
