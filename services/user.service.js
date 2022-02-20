const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("../services/nodemailer.service");
const helper = require("../helper");

const { User } = require("../models/user");

exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) throw Error("User already exists!");

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const token = await crypto.randomBytes(32).toString("hex");

    user = await new User({
      email,
      password: hash,
      token,
    }).save();

    const environment = helper(process.env.isDev);

    const confirmationUrl = `${environment}/auth/users/verify/${user.id}/${user.token}`;
    await nodemailer(user.email, confirmationUrl);

    return { message: "Please verify your email. Check your inbox!" };
  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: "Invalid email",
    });
  }
};
