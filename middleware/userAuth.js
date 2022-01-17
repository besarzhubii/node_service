const jwt = require("jsonwebtoken");

const authVerify = (req, res, next) => {
  const token = req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("Token is not provided");
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = authVerify;