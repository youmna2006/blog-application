function errorHandler(err, req, res, next) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  if (err.code === "23505") {
    return res.status(409).json({
      message: "This username or email already exists"
    });
  }

  if (err.code === "23503") {
    return res.status(400).json({
      message: "Invalid related resource"
    });
  }

  res.status(err.status || 500).json({
    message:
      err.status && err.status < 500
        ? err.message
        : "Internal server error"
  });
}

module.exports = errorHandler;