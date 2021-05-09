const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const requireLogin = require('../middlewares/reqireLogin')
const mongoose = require('mongoose')


router.get('/allPost', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name") //this will show the selected field in the given schema here it is _id and name 
        .populate("comment.postedBy", "_id name")
        .then((posts) => {
            res.send(posts)
        })
        .catch((err) => {
            console.log(err)
        })
})


router.get('/getsubpost', requireLogin, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name") //this will show the selected field in the given schema here it is _id and name 
        .populate("comment.postedBy", "_id name")
        .then((posts) => {
            res.send(posts)
        })
        .catch((err) => {
            console.log(err)
        })
})

router.post('/createPost', requireLogin, (req, res) => {
    const { title, body, photo } = req.body;
    if (!title || !body || !photo) {
        return res.status(422).json({ err: "Please add all the fields!" })
    }
    req.user.password = undefined;

    const post = new Post({
        title: title,
        body: body,
        photo: photo,
        postedBy: req.user
    })
    post.save()
        .then((result) => {
            res.json({ post: result })
        })
        .catch((err) => {
            console.log(err);
        })
})

router.get('/myPost', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user }) // can be like postedBy:req.user._id
        .populate("postedBy", "_id name")
        .then(mypost => {
            res.json({ mypost })
        })
        .catch(err => {
            console.log(err);
        })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { like: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            return res.json(result)
        }
    })
})
router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { like: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            return res.json(result)
        }
    })
})

router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id,
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comment: comment }
    }, {
        new: true // so to make the instant update
    })
        .populate("comment.postedBy", "_id name") // this is for populating the user who commented on the post
        .exec((err, result) => {
            if (err) {
                console.log(err)
                return res.status(422).json({ error: err })
            } else {
                console.log(result)
                return res.json(result)
            }
        })
})

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        res.json({ message: result })
                    })
                    .catch(err => {
                        res.status(422).json({ error: err })
                    })
            }
        })
})

module.exports = router
