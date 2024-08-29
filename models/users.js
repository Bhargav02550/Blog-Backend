const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isLoggedIn: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
