const exprees = require("express");
const router = exprees.Router();
const {Article} = require("../models/Article")

router.get("/:key" , async (req,res) => {
    const article = await Article.find({
        "$or":[{tags:{$regex :req.params.key}},
               {title:{$regex :req.params.key}}]
    })
    res.send(article)
    
})

module.exports = router;