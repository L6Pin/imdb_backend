const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const { registerUser } = require("../../services/user.service");
const { User, validateUser } = require("../../models/user");

exports.registration = async (req, res) => {
  try {
    const { error } = validateUser(req.body);

    if (error)
      return res.status(400).json({
        message:
          error.details[0].context.key === "email"
            ? "Incorrect email"
            : "Incorrect password",
      });

    await registerUser(req);
    return res.status(200).json({
      status: 200,
      message: "Registration successful. Please check your email!",
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: "User already exists!",
    });
  }
};

exports.userVerification = async (req, res) => {
  const { id } = req.params;

  // Check for the user with the id and token
  const user = await User.findOne({ _id: id });

  if (user) {
    // if there is a user change isConfirmed to true
    user.isConfirmed = true;
    user.save();
    res.send("You have successfully verified your email");
  } else {
    res.json("User not found!");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Incorrect password!",
      });
    }

    if (isPasswordValid && user.isConfirmed) {
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.SECRET_MESSAGE,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.status(200).json({
            message: "You logged in successfuly!",
            token,
          });
        }
      );
    } else
      return res.status(400).json({
        message: "User account not verified. Please check you email!",
      });
  } catch (e) {
    message: "Server error!";
  }
};

exports.facebookLogin =  (req, res) =>{
    if (req.user) {
      const { email } = req.user._json;
      User.findOne({ email }, (err, user) => {
        if (!user.password) {
          const {id} = user
          res.json({
            message: "Create new password",
            id
          });
        }
        if (user.password) {
          const {id} = user;
          jwt.sign(
            {id},
            process.env.SECRET_MESSAGE,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) {
                throw err;
              }
              res.status(200).json({
                message: "You logged in successfuly!",
                token,
              });
            }
          );
        }
      });
    }
}
