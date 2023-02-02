const router = require("express").Router();

const { validateStory, validateUpdatedStory } = require("../validation/validation");
const authorization = require("../middleware/authorization");
const { createStory, updateStory, deleteStory } = require("../helpers/storyHelper");

//Stories
//GET /stories
router.get("/", authorization, (req, res) => {});

//GET /stories/new
router.get("/new", authorization, (req, res) => {
  res.render("storyNew", {
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
    res.status(400).render("storyNew", {
      title: "Create a new Story",
      error: error.details[0].message,
      title,
      description,
    });
    return;
  }
  //Create new Story
  const result = await createStory(req, res);
  if (result.status) {
    //Flash Message - Story created
    req.flash("success_msg", "Story successfuly created!");
    //Redirect to Dashboard
    res.status(200).redirect("/dashboard");
    return;
  }
  res.status(500).send();
  //Flash Message - DB Failure
  req.flash("error_msg", `Database Error: ${result}`);
  //Redirect to Login
  res.redirect("/dashboard");
});

//Story Details / Edit Story
router.get("/details", authorization, (req, res) => {
  res.render("storyDetail", {
    title: `Edit your Story`,
    layout: "./layouts/main",
    user: {
      userID: req.user.userID,
    },
    story: {
      id: req.query.story,
      title: req.query.title,
      description: req.query.desc,
      lastmodified: req.query.lastmodified,
    },
  });
});

//Update Story
//POST /stories
router.post("/update", authorization, async (req, res) => {
  console.log(req.body);
  //Check for valid body (story) - Check HTML Form Data
  const { error } = validateUpdatedStory(req.body);
  if (error) {
    const { storyID, title, description } = req.body;
    res.status(400).render("storyDetail", {
      error: error.details[0].message,
      storyID,
      title,
      description,
    });
    return;
  }
  //Update Story
  const result = await updateStory(req, res);
  if (result.status) {
    //Flash Message - Story updated
    req.flash("success_msg", "Story successfuly updated!");
    //Redirect to Dashboard
    res.redirect("/dashboard");
    return;
  }
  res.status(500).send();
  //Flash Message - DB Failure
  req.flash("error_msg", `Database Error: ${result}`);
  //Redirect to Login
  res.redirect("/dashboard");
});

//Delete Story
//DELETE /stories/delete/:id
router.get("/delete/:id", authorization, async (req, res) => {
  //Delete Story
  const result = await deleteStory(req, res);
  if (result) {
    //Flash Message - Story deleted
    req.flash("success_msg", "Story successfuly deleted!");
    res.status(200).send();
    return;
  }
  res.status(500).send();
  //Flash Message - DB Failure
  req.flash("error_msg", `Database Error: ${result}`);
});

module.exports = router;
