module.exports = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  if (!error) return next();

  return res.status(error.status || 500).send({
    message: error.message,
    status: error.status || 500
  });
};
