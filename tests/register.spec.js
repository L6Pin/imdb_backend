let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");

const { assert } = require("chai");
const { User } = require("../models/user");

chai.should();
chai.use(chaiHttp);

describe("Testing APIs", () => {
  before((done) => {
    // Before first test, empty the database
    User.deleteMany({}, done);
  });
  // Should register a user and send email to verify - DONE
  it("Should register a user and send email to verify", (done) => {
    const newUser = {
      email: "edis.sijaric95@gmail.com",
      password: "Admin123@",
    };
    chai
      .request(server)
      .post("/registration")
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(200);
        assert.equal(
          res.body.message,
          "Registration successful. Please check your email!"
        );
        done();
      });
  });
  // Should return an error message due to invalid email - DONE
  it("Should return an error message due to invalid email", (done) => {
    const newUser = {
      email: "edis.sijaric95@hotmail.ba",
      password: "Admin123@",
    };
    chai
      .request(server)
      .post("/registration")
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        assert.equal(res.body.message, "Incorrect email");
        done();
      });
  });
  // Should return an error message due to invalid password - DONE
  it("Should return an error message due to invalid password", (done) => {
    const newUser = {
      email: "edis.sijaric95@gmail.com",
      password: "admin123",
    };
    chai
      .request(server)
      .post("/registration")
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        assert.equal(res.body.message, "Incorrect password");
        done();
      });
  });
  // Should return an error message due to an email address that already exists - DONE
  it("Should return an error message due to an email address that already exists", (done) => {
    const newUser = {
      email: "edis.sijaric95@gmail.com",
      password: "Admin123@",
    };
    chai
      .request(server)
      .post("/registration")
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        assert.equal(res.body.message, "User already exists!");
        done();
      });
  });
  // Should return an error message because the email has not been verified - DONE
  it("Should return an error message because the email has not been verified", (done) => {
    const newUser = {
      email: "edis.sijaric95@gmail.com",
      password: "Admin123@",
    };
    chai
      .request(server)
      .post("/login")
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        assert.equal(
          res.body.message,
          "User account not verified. Please check you email!"
        );
        done();
      });
  });
  // Should return 200 if the email is successfully verified - DONE
  it("Should return 200 if the email is successfully verified", async () => {
    const newUser = await User.findOne({ email: "edis.sijaric95@gmail.com" });
    chai
      .request(server)
      .get(`/users/verify/${newUser.id}/${newUser.token}`)
      .end((err, res) => {
        res.should.have.status(200);
      });
  });

  //Should return an error message because the email doesn't exist - DONE
  it("Should return an error message because the email doesn't exist", (done) => {
    const newUser = {
      email: "random@gmail.com",
      password: "adminRandom",
    };
    chai
      .request(server)
      .post("/login")
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        assert.equal(res.body.message, "User does not exist!");
        done();
      });
  });

  // Should return an error message because the password is incorrect - DONE

  it("Should return an error message because the password is incorrect", (done) => {
    const newUser = {
      email: "edis.sijaric95@gmail.com",
      password: "adminRandom",
    };
    chai
      .request(server)
      .post("/login")
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(400);
        assert.equal(res.body.message, "Incorrect password!");
        done();
      });
  });

  // Should return 200 and success message if the user is successfully logged in - DONE
  it("Should return 200 and success message if the user is successfully logged in", (done) => {
    const newUser = {
      email: "edis.sijaric95@gmail.com",
      password: "Admin123@",
    };
    chai
      .request(server)
      .post("/login")
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(200);
        assert.equal(res.body.message, "You logged in successfuly!");
        done();
      });
  });
});
