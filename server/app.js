var express = require("express");
var cookieParser = require("cookie-parser");
const logger = require("morgan");
var app = express();

require("dotenv").config();
const cors = require("cors");
const User = require("./middleware/schema/user");
var indexRouter = require("./routes/auth");
var usersRouter = require("./routes/users");
// con
require("./middleware/helper/mongodb/mongodb");

const PORT = 5002;

app.use(logger("dev"));

async function createNewUser() {
  try {
    const user = await User.create({
      firstName: "Raghav",
      lastName: "SHARMA",
      email: "raghavsharma@example.com",
    });
    console.log(user);
  } catch (error) {
    console.error(error.message);
  }
}
// createNewUser();

// findUser();

// view engine setup

// app.use(logger("dev"));
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/", indexRouter);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

module.exports = app;
