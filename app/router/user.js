const exprees = require("express");
const router = exprees.Router();
const { User } = require("../models/User");
const auth = require("../middleware/auth");

router.get("/", auth ,async (req, res) => {
  const user = await User.find().select("-password");
  res.send(user);
});


module.exports = router;
