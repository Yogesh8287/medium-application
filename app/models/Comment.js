const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    comment:{
        type:String
    },
    commentedBy:{
        type:mongoose.Schema.Types.ObjectId , ref:"user"
    },
    replies:[{
        reply: String,
        repliedBy: {
            type:mongoose.Schema.Types.ObjectId , ref:"user"
        }
    }],
    
})

const Comment = mongoose.model('comment' , commentSchema);

module.exports = Comment