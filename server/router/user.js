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

router.put("/follow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            // if pushed perfectily then the loggedIn user following is updated 
            User.findByIdAndUpdate(req.user._id, {
                $push: { following: req.body.followId }
            }, { new: true }).select("-password").then(result => {
                return res.json(result)
            }).catch(err => {
                return res.status(422).json({ error: err })
            })
        }
    )
})

router.put("/unfollow", requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    }, { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            // if pushed perfectily then the loggedIn user following is updated 
            User.findByIdAndUpdate(req.user._id, {
                $pull: { following: req.body.unfollowId }
            }, { new: true }).select("-password").then(result => {
                return res.json(result)
            }).catch(err => {
                return res.status(422).json({ error: err })
            })
        }
    )
})

module.exports = router
