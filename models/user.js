var mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    maxlength: 20,
    trim: true,
  },
  //TODO: come back here later
  encry_password: {
    type: String,
  },
  salt: String,
  purchases: {
    type: Array,
    default: [],
  },
  role: {
    default: 0,
    type: Number,
  },
});

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securepassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securepassword(plainpassword) === this.encry_password;
  },
  securepassword: function (plainpassword) {
    if (!plainpassword) return "";

    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);

// const crypto = require('crypto');

// const secret = 'abcdefg';
// const hash = crypto.createHmac('sha256', secret)
//                    .update('I love cupcakes')
//                    .digest('hex');
// console.log(hash);
// console.log(secret)
