// Checks the input BEFORE the controller runs
const validateStock = (req, res, next) => {
  const change = req.body && req.body.change; // the number sent in the body

  // change must be a whole number (like 10 or -3) and not 0
  if (!Number.isInteger(change) || change === 0) {
    return res
      .status(400)
      .json({ message: 'change must be a whole number other than 0' });
  }

  next(); // input is fine, go to the controller
};

module.exports = validateStock;