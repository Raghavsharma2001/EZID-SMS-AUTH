const axios = require("axios");
const sendEndpoint = "https://api.ezid.io/send/otp";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

async function sendOTP(phoneNumber) {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const data = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    digits: "4",
    channel: "phone",
    target: phoneNumber,
    expiry: "5",
    claims: {
      "test-claim": "full-access",
    },
  };

  try {
    return await axios.post(sendEndpoint, data, config);
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
}

module.exports = sendOTP;
