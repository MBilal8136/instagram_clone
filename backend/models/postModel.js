import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default:"",
        max: 500,
            },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    desc: {
        type: String,
        max: 500,
    },
    img: {
        type: String,
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    tags: [{
        type: String,
    }],
},{timestamps: true});


const Post = mongoose.model('Post', postSchema);
export default Post;