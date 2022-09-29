const getTokenSecret = () => {
  const tokenSecret = require("crypto").randomBytes(64).toString("hex");
  return tokenSecret;
};

getTokenSecret();
