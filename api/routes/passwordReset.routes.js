const bcrypt = require("bcryptjs");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

const { User } = require("../../models/user");
const forgotPasswordEmail = require("../../utils/sendEmailForgotPassword");
const helper = require("../../helper");

//'TO DO - change to environment isDev variable'

const environment = "http://localhost:8080";

router.post("/", async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(404)
        .json({ message: "user with given email does not exist" });

    const link = `http://localhost:4200/reset-password/${user.id}`;

    await forgotPasswordEmail(user.email, link);

    res.status(200).json({
      message: "Password reset link sent to your email account",
    });
  } catch (error) {
    res.status(400).json({
      message: "A server error occured",
    });
  }
});

router.post("/:userId", async (req, res) => {
  try {
    const schema = Joi.object({
      password: Joi.string()
        .min(6)
        .pattern(
          new RegExp(
            "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}"
          )
        )
        .required(),
    });
    const { error } = schema.validate(req.body);
    if (error)
      return res
        .status(400)
        .send(
          "Password should have one capital letter, one lower case letter, one digit and one special symbol with minimum length of 6 characters."
        );

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send("Invalid link or expired");

    if (!user.token) return res.status(400).send("Invalid link or expired");
    const saltRounds = 10;
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    user.password = hash;
    await user.save();
    res.status(200).json({
      message: "Password reset sucessfully.",
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
});

module.exports = router;
