const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dbConnectionHelper = require("./dbConnectionHelper");
const User = require("../mongodb/models/user");

//User Login Handling
async function checkUserLogin(req, res) {
  //Open connection to mongoDB
  try {
    await dbConnectionHelper.connect();
    //Check if user exists
    const user = await User.findOne({ email: req.body.email });
    try {
      if (!user) {
        //Flash Message - User not found
        req.flash("error_msg", "Login failed");
        //Redirect to Login
        res.redirect("/users/login");
        return;
      }
      //Check User Password
      await checkUserPassword(req, res, user);
    } catch (err) {
      res.status(400);
      req.flash("error_msg", err.message);
      //Redirect to Login
      res.redirect("/users/login");
      return;
    }
  } catch (err) {
    res.status(500);
    //Flash Message - DB Failure
    req.flash("error_msg", `Database Error: ${err.message}`);
    //Redirect to Login
    res.redirect("/users/login");
  } finally {
    //Close db connection
    dbConnectionHelper.disconnect();
  }
}

//User Register Handling
async function checkUserRegistration(req, res) {
  //Hashing user password with bcrypt
  const hashPwd = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
  try {
    //Check if user not yet existing
    await dbConnectionHelper.connect();
    existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      const { firstname, lastname, email, password, password2 } = req.body;
      res.status(400).render("register", {
        title: "Register new User",
        error: `Email (${existingUser.email}) already registered`,
        firstname,
        lastname,
        email,
        password,
        password2,
      });
      return;
    }
    //Create User & save in DB
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashPwd,
    });
    const savedUser = await user.save();
    //Flash Message - Successfuly registered
    req.flash("success_msg", "Registration successful. Please log in");
    //Redirect to Login
    res.redirect("/users/login");
  } catch (err) {
    res.status(500);
    //Flash Message - DB Failure
    req.flash("error_msg", `Database Error: ${err.message}`);
    //Redirect to Login
    res.redirect("/users/login");
  } finally {
    //Close db connection
    dbConnectionHelper.disconnect();
  }
}

//Check User Password
async function checkUserPassword(req, res, user) {
  if (await bcrypt.compare(req.body.password, user.password)) {
    //Create jwt token
    const token = jwt.sign(
      {
        userID: user.id,
        userEmail: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        date: user.date,
      },
      process.env.TOKEN_SECRET
    );
    res.cookie("token", token, { maxAge: 900000, httpOnly: true });
    res.redirect("/dashboard");
    return user;
  } else {
    //Flash Message - User not found
    req.flash("error_msg", "Wrong password");
    //Redirect to Login
    res.redirect("/users/login");
    return;
  }
}

module.exports.checkUserLogin = checkUserLogin;
module.exports.checkUserRegistration = checkUserRegistration;
