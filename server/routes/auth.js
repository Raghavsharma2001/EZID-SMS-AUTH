var express = require("express");
var router = express.Router();
const axios = require("axios");
var jwt = require("jsonwebtoken");
const fs = require("fs");
const sendOTP = require("../middleware/helper/ezidAuth/sendOTP.jsx");
require("dotenv").config();

const handleAuth = require("../middleware/helper/ezidAuth/handleAuth.jsx");
const User = require("../middleware/schema/user");
const verifyJWTToken = require("../middleware/helper/jwtVerify");

const authenticateUser = require("../middleware/helper/authenticateUser/authenticateUser");

const {
  loginMiddleware,
  signupMiddleware,
} = require("../middleware/helper/Joi/joi_Validator_Middleware");

const PUBLIC_KEY = fs.readFileSync("PublicKey.pem");
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const BASE_URL_EMAIL_LINK = process.env.BASE_URL_EMAIL_LINK;

const verifyEndpoint = "https://api.ezid.io/verify/otp";
const refreshEndpoint = "https://api.ezid.io/email-link/refresh";

router.post("/login", loginMiddleware, async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const isExistingUser = await User.isThisPhoneNumberInUse(phoneNumber);
    if (isExistingUser !== true) {
      const error = new Error("No account found for this phone number");
      throw error;
    }
    const response = await sendOTP(phoneNumber);
    res.status(200).json(response.data);
  } catch (error) {
    code = error.code || 404;
    res.status(code).json({
      error: true,
      error_msg: error.message || "not found",
    });
  }
});

router.post("/signup", signupMiddleware, async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const isExistingUser = await User.isThisPhoneNumberInUse(phoneNumber);
    if (isExistingUser === true) {
      const error = new Error("user already exists");
      throw error;
    }
    const response = await sendOTP(phoneNumber);
    res.status(200).json(response.data);
  } catch (error) {
    code = error.code || 404;
    res.status(code).json({
      error: true,
      error_msg: error.message || "not found",
    });
  }
});

router.post(
  "/login-auth",
  async (req, res) => await handleAuth(req, res, false)
);
router.post(
  "/signup-auth",
  async (req, res) => await handleAuth(req, res, true)
);

router.get("/get-data", authenticateUser, async (req, res) => {
  try {
    const { sub } = req.decoded_token;

    const user = await User.findOne({ userId: sub });
    if (!user) throw new Error("User not found");

    res.json({
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    res.status(404).json({
      error: true,
      error_msg: error.message,
    });
  }
});

router.get("/logout", (req, res) => {
  return res
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .status(200)
    .json({ message: "Successfully logged out" });
});

router.get("/checkState", authenticateUser, (req, res) => {
  res.status(200);
  let cookies = {};
  // check if request contains cookies
  if (req.headers.cookie) {
    const cookiesArray = req.headers.cookie.split(";");
    // loop through cookies array and store key-value pairs in cookies object
    cookiesArray.forEach((cookie) => {
      const [key, value] = cookie.trim().split("=");
      cookies[key] = value;
    });
    // check if access_token or refresh_token exists in cookies
    if (cookies.access_token || cookies.refresh_token) {
      res.status(200).json("logged_in");
    } else {
      res.status(404);
    }
  } else {
    res.status(404);
  }
});
module.exports = router;
