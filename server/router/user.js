const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const User = require('../models/user')
const requireLogin = require('../middlewares/reqireLogin')
const mongoose = require('mongoose')

router.get('/user/:id', requireLogin, (req, res) => {
    User.find({ _id: req.params.id })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    }
                    res.json({ user, posts })
                })
        })
        .catch(err => {
            return res.status(404).json({ error: "The user dose not exist" })
        })
})

module.exports = router
