const verifyAdminToken = require("./verifyAdminToken.js");
const axios = require("axios");

// Middleware to check authentication

const authenticate = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Missing token" });
  }

  const token = authorizationHeader.slice(7);

  // Verify and decode the token
  const user = verifyAdminToken(token);

  if (user && user.error === "TokenExpiredError") {
    // Token has expired, inform the frontend to log out
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Token expired" });
  }

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - Invalid token" });
  }

  // Attach the user to the request for later use
  req.user = user;
  console.log(user);
  next();
};

module.exports = authenticate;
