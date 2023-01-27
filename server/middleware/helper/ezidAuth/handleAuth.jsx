const axios = require("axios");
const verifyEndpoint = "https://api.ezid.io/verify/otp";
var jwt = require("jsonwebtoken");
// const User = require("../schema/user.js");
var User = require("../../schema/user.js");
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const handleAuth = async (req, res, isSignup) => {
  // console.log(req.body);

  try {
    // common logic
    const { phoneNumber, login_id, otp } = req.body;
    const data = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      otp,
      login_id,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let sub;

    // const { data: response } = await axios.post(verifyEndpoint, data, config)
    const response = await axios
      .post(verifyEndpoint, data, config)
      .catch((err) => {
        const error = new Error("Invalid OTP");
        throw error;
      });

    const { accessToken: access_token, refreshToken: refresh_token } =
      response.data;

    const decoded = jwt.decode(access_token);
    sub = decoded.sub;
    if (isSignup) {
      // additional signup logic
      const { firstName, lastName } = req.body;
      const user = await User.create({
        firstName,
        lastName,
        phoneNumber,
        userId: sub,
      });
    }
    // common logic
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 5 * 60 * 1000);
    const six_month = new Date(
      currentDate.getTime() + 183 * 24 * 60 * 60 * 1000
    );
    res
      .status(201)
      .cookie("access_token", access_token, {
        secure: false,
        httpOnly: true,
        expires: expiryDate,
        sameSite: "lax",
      })
      .cookie("refresh_token", refresh_token, {
        secure: false,
        httpOnly: true,
        expires: six_month,
        sameSite: "lax",
      })
      .json({ message: "Logged in successfully" });
  } catch (error) {
    const code = error.code || 404;
    res.status(code).json({
      error: true,
      error_msg: error.message || "not found",
    });
  }
};
module.exports = handleAuth;
