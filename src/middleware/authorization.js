const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const userJwtToken = req.cookies.token;
  if (!userJwtToken) {
    //Flash Message - Access denied
    req.flash("error_msg", "Access denied. Please log in");
    //Redirect to Login
    res.redirect("/users/login");
    return;
  }
  try {
    req.user = jwt.verify(userJwtToken, process.env.TOKEN_SECRET);
    next();
  } catch (err) {
    //Flash Message - Token invalid
    req.flash("error_msg", "Invalid Token.");
    //Redirect to Login
    res.redirect("/users/login");
  }
};
