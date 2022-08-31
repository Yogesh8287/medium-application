const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  bookmark:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "article"
  }]
});

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(4).trim(true).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(user);
}

const { privatekey, JWT_EXPIRES_IN } = process.env;
userSchema.methods.generateAuthToken = function () {
  const payload = {
    _id: this._id,
    name: this.name,
    isAdmin: this.isAdmin,
  };
  return jwt.sign(payload, privatekey, { expiresIn: JWT_EXPIRES_IN });
};
const User = mongoose.model("user", userSchema);

exports.User = User;
exports.validate = validateUser;
