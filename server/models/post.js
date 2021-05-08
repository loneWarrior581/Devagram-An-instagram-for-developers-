const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    like: [{ type: ObjectId, ref: "User" }],
    comment: [{
        text: String,
        postedBy: { type: ObjectId, ref: 'User' }
    }],
    postedBy: {
        type: ObjectId,// This is the id of the saved user
        ref: "User"
    }

})

module.exports = mongoose.model('Post', postSchema)