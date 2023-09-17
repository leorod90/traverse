const ErrorResponse = require("../utils/response")

const errorHandler = (err, req, res, next) => {
  let error = { ...err }

  error.message = err.message

  switch (err.name) {
    case "CastError":
      {
        const message = `Bootcamp not found with id of ${err.value}`
        error = new ErrorResponse(message, 404)
        break;
      }
    case "ValidationError":
      {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 404)

        break;
      }
    default:
      break;
  }

  switch (err.code) {
    case 11000:
      const message = `Duplicate field entered`
      error = new ErrorResponse(message, 400)
      break;

    default:
      break;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  })
}

module.exports = errorHandler