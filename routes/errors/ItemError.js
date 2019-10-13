module.exports = class CustomError extends Error {
  constructor(httpStatus, reason, errors, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.name = 'ItemError';
    this.date = new Date();
    
    this.httpStatus = httpStatus;
    this.reason = reason;
    this.message = message;
    this.errors = errors;    
  }

  addError(err) {
    this.errors.push(err);
  }

  asJSON() {
    return {
      name: this.name,
      date: this.date,
      reason: this.reason,
      msg: this.message,
      errors: this.errors
    };
  }
}


