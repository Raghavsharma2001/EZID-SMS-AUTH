const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    maxLength: 200,
  },
  lastName: {
    type: String,
    maxLength: 200,
    minLength: 5,
  },
  phoneNumber: { type: String, required: true, unique: true },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  userId: { type: String, required: true, unique: true },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

UserSchema.statics.isThisPhoneNumberInUse = async function (phoneNumber) {
  if (!phoneNumber) throw new Error("Invalid Phone Number");
  try {
    const user = await this.findOne({ phoneNumber });
    if (user) return true;
    return false;
  } catch (err) {
    return false;
  }
};

module.exports = mongoose.model("User", UserSchema);
