class AppError extends Error {
  constructor(message, statusCode) {
    super();
    // console.log("called");

    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
