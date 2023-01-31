const dbConnectionHelper = require("./dbConnectionHelper");
const Story = require("../mongodb/models/Story");
const dateHelper = require("./dateHelper");

//Create new story
async function create(req, res) {
  const story = new Story({
    title: req.body.title,
    description: req.body.description,
    userID: req.user.userID,
  });
  try {
    await dbConnectionHelper.connect();
    const newStory = await story.save();
    if (newStory) {
      return { status: true, inserted: newStory };
    }
  } catch (err) {
    return err;
  } finally {
    //Close db connection
    dbConnectionHelper.disconnect();
  }
}

//Update existing story
async function update(req, res) {
  try {
    await dbConnectionHelper.connect();
    const result = await Story.findOneAndUpdate(
      { _id: req.body.storyId },
      { $set: { title: req.body.title, description: req.body.description, updated: Date.now() } }
    );
    if (result) {
      return { status: true, updated: result };
    }
  } catch (err) {
    return err;
  } finally {
    //Close db connection
    dbConnectionHelper.disconnect();
  }
}

async function deleteStory(req, res) {
  try {
    await dbConnectionHelper.connect();
    //Delete selected story
    const deleted = await Story.deleteOne({ _id: req.params.id });
    if (deleted.deletedCount === 1) {
      return true;
    }
    return false;
  } catch (err) {
    res.status(500);
    //Flash Message - DB Failure
    req.flash("error_msg", `Database Error: ${err.message}`);
  } finally {
    //Close db connection
    dbConnectionHelper.disconnect();
  }
}

//Get stories from specific user
async function getStories(userID) {
  try {
    await dbConnectionHelper.connect();
    const stories = await Story.find()
      .populate("userID")
      .select("title description created updated")
      .where("userID")
      .equals(userID)
      .sort({ created: -1 });
    //Adding formatted date fields for existing stories
    if (stories.length !== 0) {
      stories.forEach((s) => {
        s.formattedCreated = dateHelper(s.created);
        s.formattedUpdated = dateHelper(s.updated);
      });
    }
    return stories;
  } catch (err) {
    return err;
  } finally {
    dbConnectionHelper.disconnect();
  }
}

module.exports.createStory = create;
module.exports.updateStory = update;
module.exports.deleteStory = deleteStory;
module.exports.getStories = getStories;
