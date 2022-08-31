const jwt = require("jsonwebtoken");

const { privatekey } = process.env;

function auth(req, res, next) {
  let token = req.header("Authorization");
  if (!token) return res.status(401).send("Access denied.");

  token = token.split(" ")[1];
  try {
    const decoded = jwt.verify(token, privatekey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}

module.exports = auth;
