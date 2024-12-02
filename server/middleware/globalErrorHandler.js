import CustomError from "../utils/customError.js";

const globalErrorHandler = (err, req, res, next) => {
  let message = err.message || "Internal Server Error";
  let statusCode = err.statusCode || 500;

  // res in development mode
  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      success: false,
      message,
      error: err,
      stackTrace: err.stack,
    });
  }

  // res in production mode

  if (process.env.NODE_ENV === "production") {
    let copyError = { ...err };

    // wrong mongoose object id error
    if (copyError.name === "CastError") {
      message = `Resource not found. Invalid : ${copyError.path}`;
      copyError = new CustomError(message, 404);
    }
    //Handling mongoose validation error
    if ((copyError.name = "ValidationError")) {
      message = Object.values(copyError.errors).map((value) => value.message);
      copyError = new CustomError(message, 400);
    }

    // handle mongoose duplicate key error
    if (copyError.code === 11000) {
      message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      copyError = new CustomError(message, 400);
    }

    //handling wrong jwt token error
    if (copyError.name === "jsonWebTokenError") {
      message = `JSON Web token is invalid. Try Again!`;
      copyError = new CustomError(message, 500);
    }
    // handling Expired jwt token error
    if (copyError.name === "TokenExpiredError") {
      message = `Json web token is expired. Try Again!`;
      copyError = new CustomError(message, 500);
    }

    res.status(copyError.statusCode).json({
      success: false,
      message: copyError.message || "Internal Server Error",
    });
  }
};

export default globalErrorHandler;
