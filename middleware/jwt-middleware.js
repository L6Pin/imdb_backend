const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_MESSAGE);
    next();
  } catch (error) {
    res.status(401).json({ message: "Access denied. Please login again." });
  }
};
