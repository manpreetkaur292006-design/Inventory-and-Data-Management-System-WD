const errorHandler = (err, req, res, next) => {
  console.log('Error:', err.message); // shows the error message in the terminal

  // a schema rule was broken (negative price, missing name...)
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  // a value has the wrong format (for example an ID like "123")
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid value for ${err.path}` });
  }

  // duplicate SKU (11000 is MongoDB's duplicate error code)
  if (err.code === 11000) {
    return res.status(409).json({ message: 'A product with this SKU already exists' });
  }

  // anything else (for example broken JSON sent from Postman)
  res.status(err.statusCode || 500).json({ message: err.message });
};

module.exports = errorHandler;