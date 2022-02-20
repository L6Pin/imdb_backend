const mongoose = require("mongoose");

exports.connectDB = () => {
    mongoose.connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.a9doj.mongodb.net/Users?retryWrites=true&w=majority`
    );
}