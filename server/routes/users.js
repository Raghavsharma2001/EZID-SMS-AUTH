var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;

router.post("/signup-auths", async (req, res) => {
  // console.log("testing");
  let access_token, id_token, refresh_token;
  try {
    const { phoneNumber, firstName, lastName, login_id, otp } = req.body;
    console.log(req.body);

    const data = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      otp: otp,
      login_id: login_id,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let sub;
    const response = await axios
      .post(verifyEndpoint, data, config)
      .then((res) => {
        access_token = res.data.accessToken;

        refresh_token = res.data.refreshToken;
        const decoded = jwt.decode(access_token);
        sub = decoded.sub;
        console.log(sub);
      })
      .catch((err) => {
        console.error(err);
        const error = new Error("Invalid auth code");
        throw error;
      });
    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      userId: sub,
    });

    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 5 * 60 * 1000);
    const six_month = new Date(
      currentDate.getTime() + 183 * 24 * 60 * 60 * 1000
    );
    res
      .status(201)
      .cookie("access_token", access_token, {
        secure: false, // this determines whether or not the cookie requires an SSL or HTTPS connection to be retrieved.
        // For this example, it is set to false as typically localhost does not have a HTTPS connection.
        // For production applications, this is highly reccomended to be set to true
        httpOnly: true,
        expires: expiryDate, // here you can set your own expiry. For the purposes of this example, it is set to 1 day
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
    console.log(error);

    code = error.code || 404;
    res.status(code).json({
      error: true,
      error_msg: error.message || "not found",
    });
  }
});

router.post("/login-auths", async (req, res) => {
  // console.log("testing");
  let access_token, id_token, refresh_token;
  try {
    const { phoneNumber, login_id, otp } = req.body;
    console.log(req.body);

    const data = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      otp: otp,
      login_id: login_id,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios
      .post(verifyEndpoint, data, config)
      .then((res) => {
        access_token = res.data.accessToken;

        refresh_token = res.data.refreshToken;
        console.log(res.data);
      })
      .catch((err) => {
        const error = new Error("Invalid auth code");
        throw error;
      });

    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + 5 * 60 * 1000);
    const six_month = new Date(
      currentDate.getTime() + 183 * 24 * 60 * 60 * 1000
    );
    res
      .status(201)
      .cookie("access_token", access_token, {
        secure: false, // this determines whether or not the cookie requires an SSL or HTTPS connection to be retrieved.
        // For this example, it is set to false as typically localhost does not have a HTTPS connection.
        // For production applications, this is highly reccomended to be set to true
        httpOnly: true,
        expires: expiryDate, // here you can set your own expiry. For the purposes of this example, it is set to 1 day
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
    code = error.code || 404;
    res.status(code).json({
      error: true,
      error_msg: error.message || "not found",
    });
  }
});
const verifyAuth = async (req, res) => {
  try {
    const { phoneNumber, firstName, lastName, login_id, otp } = req.body;
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
    const { data: response } = await axios.post(verifyEndpoint, data, config);
    const { accessToken: access_token, refreshToken: refresh_token } = response;
    const decoded = jwt.decode(access_token);
    sub = decoded.sub;
    const user = await User.create({
      firstName,
      lastName,
      phoneNumber,
      userId: sub,
    });

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
router.post("/signup-auth", verifyAuth);
