//Imports
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const expressSession = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

//Config .env
dotenv.config({ path: `${__dirname}/config/config.env` });

//Express
const app = express();
const port = process.env.PORT || 4444;
app.listen(port, () => console.log(`Server listening on port ${port}`));

//Logging
app.use(morgan("dev"));

//HTTP Bodyparser
app.use(express.urlencoded({ extended: false }));

//Cookie Parser
app.use(cookieParser());

//Express Session
app.use(
  expressSession({
    secret: "sercret",
    saveUninitialized: true,
    resave: true,
  })
);

//Connect flash / Flash Messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success_msg");
  res.locals.errorMsg = req.flash("error_msg");
  next();
});

//Template Engine - EJS
app.use(expressLayouts);
app.set("views", path.join(__dirname, "/views"));
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

//Static folder
app.use(express.static("public"));
app.use("/css", express.static(path.join(__dirname, "/public/css")));
app.use("/res", express.static(path.join(__dirname, "/public/res")));
app.use("/js", express.static(path.join(__dirname, "/public/js")));

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/stories", require("./routes/stories"));

//Handling invalid Routes
app.use((req, res, next) => {
  res.status(404);
  //Response - HTML
  if (req.accepts("html")) {
    res.render("error", {
      title: "404 - Not found",
      layout: "./layouts/welcome",
    });
    //Response JSON
  } else if (req.accepts("json")) {
    res.send({ error: "Not found" });
  }
});
