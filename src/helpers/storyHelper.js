const dbConnectionHelper = require("./dbConnectionHelper");
const Story = require("../mongodb/models/story");

async function createStory(req, res) {
  //Create an user instance & save in db
  const story = new Story({
    title: req.body.title,
    description: req.body.description,
    userID: req.user.userID,
  });
  try {
    await dbConnectionHelper.connect();
    const savedStory = await story.save();
    //Flash Message - Story created
    req.flash("success_msg", "Story successfuly created!");
    //Redirect to Dashboard
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500);
    //Flash Message - DB Failure
    req.flash("error_msg", `Database Error: ${err.message}`);
    //Redirect to Login
    res.redirect("/dashboard");
  } finally {
    //Close db connection
    dbConnectionHelper.disconnect();
  }
}

//Get stories from specific user
async function getStories(userID) {
  try {
    await dbConnectionHelper.connect();
    const stories = await Story.find().populate("userID").select("title description").where("userID").equals(userID);
    return stories;
  } catch (err) {
    res.status(500);
    //Flash Message - DB Failure
    req.flash("error_msg", `Database Error: ${err.message}`);
    //Redirect to Login
    res.redirect("/dashboard");
  } finally {
    dbConnectionHelper.disconnect();
  }
}

module.exports.createStory = createStory;
module.exports.getStories = getStories;
