// src/utils/AppError.ts
// Custom error class for expected errors (400, 401, 403, 404, etc.)
// When you throw AppError, the global handler returns a clean JSON response
// When any other error is thrown, the handler returns 500

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true // expected error — don't log stack trace

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, AppError.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}

// ── Common error helpers ───────────────────────────────────────────────────
export const notFound = (resource = 'Resource') =>
  new AppError(`${resource} not found`, 404)

export const unauthorized = (msg = 'Unauthorized — please login') =>
  new AppError(msg, 401)

export const forbidden = (msg = 'You do not have permission to do this') =>
  new AppError(msg, 403)

export const badRequest = (msg: string) =>
  new AppError(msg, 400)
