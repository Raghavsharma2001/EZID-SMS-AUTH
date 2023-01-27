const { validationResult } = require("express-validator");

//middleware to handle any errors that may occur
// if errors are encountered then response is sent with 400  status and error message
//else proceed to next middleware function
exports.errorHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};
