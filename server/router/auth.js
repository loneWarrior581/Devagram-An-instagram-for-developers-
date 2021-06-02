require('dotenv').config();
const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const User = require('../models/user');
const requireLogin = require('../middlewares/reqireLogin')//this is the middleware for authoraistion 
const JWT_TOKEN = process.env.JWT_TOKEN;

// router.get('/protected',requireLogin,(req,res)=>{
//     res.send("this is the protected resource")
// })

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
        return res.status(422).json({ error: "Please enter all the fields" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User already exist with this email" });
            }
            bcrypt.hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        name,
                        email,
                        password: hashedPassword
                    });

                    user.save()
                        .then(user =>
                            res.json({ message: "responce recorded sucessfully" }))
                        .catch(err => console.log(err.message))
                })

        })
        .catch((err) => console.log(err.message));
})


router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please provide the email or password" });
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid email or password" });
            }
            const { _id, name, email, followers, following } = savedUser;
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.json({message:"sucessfully loged in"})
                        const token = jwt.sign({ _id: savedUser._id }, JWT_TOKEN)
                        res.json({ message: "signed in sucessfully", token: token, user: { _id, name, email, followers, following } })
                    }
                    else {
                        return res.status(422).json({ error: "Invalid email or password" });
                    }
                })
                .catch(err => console.log(err.message))
        }).catch(err => console.log(err.message))
})




module.exports = router;