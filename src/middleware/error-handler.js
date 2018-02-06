module.exports = (error, req, res, next) => {
  if (!error) return next();
  console.error(error);

  return res.status(error.status || 500).send({
    message: error.message,
    status: error.status || 500
  });
};
