const mongoose = require("mongoose");

//Connect to mongoDB
const getConnection = async () => {
  await mongoose.connect(`${process.env.MONGODB_URI}${process.env.DB_NAME}`);
};

const closeConnection = async () => {
  await mongoose.disconnect;
};

module.exports.connect = getConnection;
module.exports.disconnect = closeConnection;
