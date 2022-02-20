const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
    required: false,
  },
  isConfirmed: {
    type: Boolean,
    required: false,
    default: false,
  },
  registerSource:{
    type: String
  }
});

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .required()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
    password: Joi.string().pattern(
      new RegExp(
        "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}"
      )
    ),
  }).with("email", "password");

  return schema.validate(user);
};

module.exports = { User, validateUser };
