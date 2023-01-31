const router = require("express").Router();

const authorization = require("../middleware/authorization");
const { getStories } = require("../helpers/storyHelper");

//Routes

//Welcome Landing page
//GET /
router.get("/", (req, res) => {
  //Check for valid token - if true redirect to dashboard
  if (req.cookies.token) return res.redirect("/dashboard");
  res.render("welcome", {
    title: "Welcome - Vinher Test App",
    layout: "./layouts/welcome",
  });
});

//Dashboard
//GET /dashboard
router.get("/dashboard", authorization, async (req, res) => {
  const userStories = await getStories(req.user.userID);
  res.render("dashboard", {
    title: `Dashboard ${req.user.firstname} ${req.user.lastname}`,
    layout: "./layouts/main",
    username: `${req.user.firstname} ${req.user.lastname}`,
    user: {
      userID: req.user.userID,
      email: req.user.userEmail,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      date: req.user.date,
      stories: userStories,
    },
  });
});

module.exports = router;
