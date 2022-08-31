const exprees = require("express");
const router = exprees.Router();
const _ = require("lodash");
const {User} = require('../models/User')
const { Article, validate } = require("../models/Article");
const Comment = require("../models/Comment")
const auth = require("../middleware/auth");

router.get("/", [auth], async (req, res) => {
  const article = await Article.find().populate('comments');
  res.send(article);
});

router.get("/:id", [auth], async (req, res) => {
  const article = await Article.find({_id : req.params.id}).populate('comments');
  if(!article) return res.status(404).send("Article not found")

  res.send(article);
});


router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const article = new Article(
    _.pick(req.body, ["title", "description", "author" ,"tags"])
  );

  await article.save();
  res.send(article);
});

router.put("/:id/like", [auth], async (req, res) => {
  const article = await Article.findById(req.params.id);

  if(!article.likes.includes(req.user._id)){
    article.likes.push(req.user._id)
  }else{
    const index = article.likes.indexOf(req.user._id)
    article.likes.splice(index,1)
  }

  await article.save()
  res.send(article);
});

router.put("/:articleId/comment", [auth], async (req, res) => { 
  const article = await Article.findById(req.params.articleId);
  if (!article) return res.status(404).send("Article Not found");

  const comment = new Comment({
    comment:req.body.comment,
    commentedBy:req.user._id
  });
  await comment.save();

  article.comments.push(comment._id);
  await article.save();

  res.send(article);
});

router.put("/:articleId/:commentId/reply", [auth],async (req,res) => {
  const article = await Article.findById(req.params.articleId);
  if (!article) return res.status(404).send("Article Not found");

  if (!article.comments.includes(req.params.commentId))
   return res.status(404).send("Comment not found")

  const comment = await Comment.findById(req.params.commentId)

  const reply = {reply: req.body.reply, repliedBy: req.user._id};
  comment.replies.push(reply);
  await comment.save();
  
  res.send(article);
})

router.put("/:articleId/bookmark" , auth , async (req,res) => {

  const user = await User.findById(req.user._id).select("-password");
  user.bookmark.push(req.params.articleId)
  await user.save()
  res.send(user);

})


module.exports = router;
