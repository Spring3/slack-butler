module.exports = (req, res) => {
  res.status(404);
  return res.redirect('/notfound');
};
