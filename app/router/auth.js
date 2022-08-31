const exprees = require("express");
const bcrypt = require("bcrypt");
const router = exprees.Router();
const _ = require("lodash");
const { User, validate } = require("../models/User");
const auth = require("../middleware/auth");

router.post("/signup", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const validUser = await User.findOne({ email: req.body.email });
  if (validUser) return res.status(400).send("already registered");

  const user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res.send({ user: _.pick(user, ["_id", "name", "email"]), token });
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validpassword = bcrypt.compare(req.body.password, user.password);
  if (!validpassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();
  res.send({ user: _.pick(user, ["_id"]), token });
});

module.exports = router;
