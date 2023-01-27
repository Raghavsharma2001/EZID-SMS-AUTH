const { isValidLoginSchema, isValidSignUpSchema } = require("./joi_Validator");

// this middleware function is responsible for validating the request body for /signup endpoint
const signupMiddleware = async (req, res, next) => {
  isValidSignUpSchema
    .validateAsync(req.body, { abortEarly: false, stripUnknown: true })
    .then((results) => {
      next();
    })
    .catch((err) => {
      console.log("Error Occurred In Signup Middleware ");
      res.status(422).json({
        error: true,
        error_msg: err.message || "not found",
      });
    });
};

// this middleware function is responsible for validating the request body for /login endpoint checks all parameters
const loginMiddleware = async (req, res, next) => {
  isValidLoginSchema
    .validateAsync(req.body, { abortEarly: false, stripUnknown: true })
    .then((results) => {
      console.log(results);
      next();
    })
    .catch((err) => {
      res.status(422).json({
        error: true,
        error_msg: err.message || "not found",
      });
    });
};

module.exports = { signupMiddleware, loginMiddleware };
