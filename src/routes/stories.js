const router = require("express").Router();

const { validateStory } = require("../validation/validation");
const authorization = require("../middleware/authorization");
const { createStory } = require("../helpers/storyHelper");

//Stories
//GET /stories
router.get("/", authorization, (req, res) => {});

//GET /stories/new
router.get("/new", authorization, (req, res) => {
  res.render("story", {
    title: `Create a new Story`,
    layout: "./layouts/main",
    user: {
      userID: req.user.userID,
    },
  });
});

//Create new Story
//POST /stories
router.post("/new", authorization, async (req, res) => {
  //Check for valid body (story) - Check HTML Form Data
  const { error } = validateStory(req.body);
  if (error) {
    const { title, description } = req.body;
    res.status(400).render("story", {
      title: "Create a new Story",
      error: error.details[0].message,
      title,
      description,
    });
    return;
  }
  //Create new Story
  await createStory(req, res);
});

module.exports = router;
