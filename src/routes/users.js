const router = require("express").Router();

const { checkUserLogin, checkUserRegistration } = require("../helpers/userHelper");
const validation = require("../validation/validation");

//Routes

//GET /register
router.get("/register", (req, res) => {
  res.render("register", {
    title: "Register new User",
    layout: "./layouts/welcome",
  });
});

//GET /login
router.get("/login", (req, res) => {
  res.render("login", { title: "Login", layout: "./layouts/welcome" });
});

//GET /logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  //Flash Message - Successfuly registered
  req.flash("success_msg", "Successfully logged out");
  //Redirect to Login
  res.redirect("/users/login");
});

//Register new User
//POST /register
router.post("/register", async (req, res) => {
  //Check for valid body (user) - Check HTML Form Data
  const { error } = validation.validateRegisterUser(req.body);
  if (error) {
    const { firstname, lastname, email, password, password2 } = req.body;
    res.status(400).render("register", {
      title: "Register new User",
      error: error.details[0].message,
      firstname,
      lastname,
      email,
      password,
      password2,
    });
    return;
  }
  await checkUserRegistration(req, res);
});

//Login User
//POST /login
router.post("/login", async (req, res) => {
  //Check for valid body (user) - Check HTML Form Data
  const { error } = validation.validateLoginUser(req.body);
  if (error) {
    //Flash Message - Validation failure
    req.flash("error_msg", error.details[0].message);
    //Redirect to Login
    res.redirect("/users/login");
    return;
  }
  await checkUserLogin(req, res);
});

module.exports = router;
