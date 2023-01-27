const fs = require("fs");
const PUBLIC_KEY = fs.readFileSync("PublicKey.pem");
var jwt = require("jsonwebtoken");

async function verifyJWTToken(token, asymmetricAlg) {
  var decoded;
  // get key to verify JWT token
  const key = asymmetricAlg ? PUBLIC_KEY : process.env.TOKEN_SECRET;
  // console.log(token);
  try {
    decoded = jwt.verify(token, key);
  } catch (err) {
    console.log("JWT error " + err);
    if (err == "TokenExpiredError: jwt expired") {
      console.log("JWT Expired");
      decoded = "JWT Expired";
    } else {
      const error = new Error("Unauthorized");
      throw error;
    }
  }

  return decoded;
}

module.exports = verifyJWTToken;
