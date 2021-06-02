require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const app = express()
const User = require('./models/user');

mongoose.connect(process.env.MONGO_URI,
    {
        dbName: "mern-instagram",//giving the database name 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("Mongodb connected...");
    })
    .catch(() => {
        console.log("Connection failed...")
    });
//middlewares
app.use(cors());
app.use(express.json());
app.use(require('./router/auth'))
app.use(require('./router/post'))
app.use(require('./router/user.js'))

app.listen(3001, () => console.log('Server running on port 3001'));