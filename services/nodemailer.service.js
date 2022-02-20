const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({
  path: "../.env",
});

module.exports = async (email, confirmationUrl) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER, // generated ethereal user
      pass: process.env.GMAIL_PASSWORD, // generated ethereal password
    },
  });

  let mailOptions = {
    from: "testimdb52@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Please verify your email", // Subject line
    html: `${
      "<!DOCTYPE html>" +
      '<html lang="en">' +
      " <head>" +
      '<meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
      '<meta http-equiv="X-UA-Compatible" content="ie=edge">' +
      "<title>Email Verification</title>" +
      "</head>" +
      "<body>" +
      "  <h1>Email Verification</h1>" +
      "  <h4>Click the link below!</h4><br>" +
      ' <a href="'
    }${confirmationUrl}">Click here!</a>'
    "  </body>" 
    " </html>"
  }
     `,
    text: "Verify your email", // plain text body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log("Email sent " + info.response);
  });
};
