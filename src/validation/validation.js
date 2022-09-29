const joi = require("joi");

//User Registration Validation
const validateRegisterUser = (user) => {
  const schema = joi.object({
    firstname: joi.string().min(2).max(128).required(),
    lastname: joi.string().min(2).max(128).required(),
    email: joi.string().email().required(),
    password: joi.string().required().min(6).max(255),
    password2: joi.ref("password"),
  });
  return schema.validate(user);
};

//User Login Validation
const validateLoginUser = (user) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().min(6).max(255),
  });
  return schema.validate(user);
};

//Story Validation
const validateStory = (story) => {
  const schema = joi.object({
    title: joi.string().required().min(2).max(64),
    description: joi.string().required().max(2048),
  });
  return schema.validate(story);
};

module.exports.validateRegisterUser = validateRegisterUser;
module.exports.validateLoginUser = validateLoginUser;
module.exports.validateStory = validateStory;
