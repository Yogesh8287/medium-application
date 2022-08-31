const mongoose = require("mongoose");
const Joi = require("joi");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  tags:[{
    type:String
}],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

articleSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

articleSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

articleSchema.set("toObject", { virtuals: true });
articleSchema.set("toJSON", { virtuals: true });

function validateArticle(article) {
  const schema = Joi.object({
    title: Joi.string().min(4).trim(true).required(),
    description: Joi.string().required(),
    tags: Joi.string().required(),
    author: Joi.string().required(),
  });
  return schema.validate(article);
}

const Article = mongoose.model("article", articleSchema);

exports.Article = Article;
exports.validate = validateArticle;
