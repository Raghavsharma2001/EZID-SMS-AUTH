const axios = require("axios");
require("dotenv").config();

const verifyJWTToken = require("../jwtVerify");

const refreshEndpoint = "https://api.ezid.io/email-link/refresh";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

async function getAccessToken(refresh) {
  let access_token, id_token, refresh_token;
  try {
    const data = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refresh,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios
      .post(refreshEndpoint, data, config)
      .then((res) => {
        access_token = res.data.access_token;
        id_token = res.data.id_token;
        refresh_token = res.data.refresh_token;
      })
      .catch(function (err) {
        const error = new Error("Unauthorized ");
        throw error;
      });
    return { access_token, refresh_token, id_token };
  } catch (err) {
    throw error;
  }
}
async function authenticateUser(req, res, next) {
  let cookies = {};

  try {
    if (!req.headers.cookie) {
      const error = new Error("Unauthorized");
      throw error;
    }
    const cookiesArray = req.headers.cookie.split(";");

    cookiesArray.forEach((cookie) => {
      const [key, value] = cookie.trim().split("=");
      cookies[key] = value;
    });

    if (cookies.access_token) {
      const decodedToken = await verifyJWTToken(cookies.access_token, true);
      req.decoded_token = decodedToken;

      next();
    } else if (!cookies.access_token && cookies.refresh_token) {
      const response = await getAccessToken(cookies.refresh_token)
        .then((response) => {
          const currentDate = new Date();
          const oneHourExpiry = new Date(
            currentDate.getTime() + 1 * 60 * 60 * 1000
          );
          const sixMonthExpiry = new Date(
            currentDate.getTime() + 183 * 24 * 60 * 60 * 1000
          );

          res
            .status(201)
            .cookie("access_token", response.access_token, {
              secure: false, // this determines whether or not the cookie requires an SSL or HTTPS connection to be retrieved.
              // For this example, it is set to false as typically localhost does not have a HTTPS connection.
              // For production applications, this is highly recommended to be set to true
              httpOnly: true,
              expires: oneHourExpiry, // here you can set your own expiry. For the purposes of this example, it is set to 1 day
              sameSite: "lax",
            })
            .cookie("refresh_token", response.refresh_token, {
              secure: false,
              httpOnly: true,
              expires: sixMonthExpiry,
              sameSite: "lax",
            })
            .redirect(req.originalUrl);
        })
        .catch((err) => {
          const error = new Error("Unauthorized");
          throw error;
        });
    } else {
      const error = new Error("Unauthorized");
      throw error;
    }
  } catch (error) {
    code = error.code || 404;
    res
      .clearCookie("refresh_token")
      .clearCookie("access_token")
      .status(code)
      .json({
        error: true,
        error_msg: error.message || "not found",
      });
  }
}

module.exports = authenticateUser;
