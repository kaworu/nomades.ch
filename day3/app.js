/*
 * YABE - Yet Another Blog Engine
 */
"use strict";

const express    = require('express');
const bodyParser = require('body-parser');
const mongoose   = require("mongoose");
/* our applications modules */
const Post = require("./models/post");


/* create our application */
const app = express();
/* configuration */
app.locals.name      = require("./package.json").name; // the application's name
app.locals.port      = 3000; // the port our server will listen too
app.locals.databases = {
    development: 'mongodb://localhost/yabe-development',
    testing:     'mongodb://localhost/yabe-testing',
};
/* mongoose & MongoDB stuff */
mongoose.Promise = global.Promise; // Use native promises
const is_development = (process.env.NODE_ENV === 'development');
mongoose.set('debug', is_development);
/* mongoose connection */
app.locals.connect = function () {
    const env      = process.env.NODE_ENV;
    const database = app.locals.databases[env];
    console.log(`NODE_ENV=${env}, connecting to ${database}`);
    return mongoose.connect(database, {useMongoClient: true});
};

/* setup */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// create a post
app.post("/api/posts", function (req, res, next) {
    const input = req.body;
    // app.locals.posts.push(input);
    Post.create(input).catch(next).then(created => {
        return res.status(201 /* Created */).send(created);
    });
});

// read all the posts
app.get("/api/posts", (req, res, next) => {
    Post.find({/* no conditions */}).catch(next).then(results => {
        return res.send(results);
    });
});

// read one post
app.get("/api/posts/:id", (req, res, next) => {
    const id = req.params.id;
    // callback example
    Post.findById(id, (err, found) => {
        if (found)
            return res.send(found);
        else
            return res.status(404 /* Not Found */).send();
    });
});

// update
app.put("/api/posts/:id", (req, res, next) => {
    const id    = req.params.id;
    const input = req.body;
    const promise = Post.findByIdAndUpdate(id, input, {overwrite: true, new: true});
    promise.catch(next).then(found => {
        if (found)
            return res.send(found);
        else
            return res.status(404 /* Not Found */).send();
    });
});

// partial update
app.patch("/api/posts/:id", (req, res, next) => {
    const id    = req.params.id;
    const input = req.body;
    const promise = Post.findByIdAndUpdate(id, {$set: input}, {new: true})
    promise.catch(next).then(found => {
        if (found)
            return res.send(found);
        else
            return res.status(404 /* Not Found */).send();
    });
});

// destroy
app.delete("/api/posts/:id", (req, res, next) => {
    const id = req.params.id;
    Post.findByIdAndRemove(id).catch(next).then(found => {
        if (found)
            return res.send(found);
        else
            return res.status(404 /* Not Found */).send();
    })
});

// expose our application to require
module.exports = app;
