/*
 * YABE - Yet Another Blog Engine
 */
"use strict";

/* require the module we need */
const express    = require('express');
const bodyParser = require('body-parser');
/* create our application */
const app = express();

/* configuration */

/* we can require() json files too */
app.locals.name = require("./package.json").name; // the application's name
app.locals.port = 3000; // the port our server will listen too
app.locals.posts = [ // static array of posts
    {_id: 1, title: "Bacon Avocado Salad", body: "Place bacon in a large..."},
    {_id: 2, title: "Crispy Orange Beef", body: "Lay beef strips out in..."},
    {_id: 3, title: "Simple BBQ Ribs", body: "Place ribs in a large..."},
];

/* setup */

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// create a post
app.post("/api/posts", (req, res) => {
    const post_to_create = req.body;
    /* add the given post_to_create to our posts array */
    app.locals.posts.push(post_to_create);
    /* send the newly created post with a 201 Created HTTP status */
    res.status(201 /* Created */).send(post_to_create);
});

// read all the posts
app.get("/api/posts", (req, res) => {
    /* send all posts with an explicit 200 OK HTTP status */
    res.status(200 /* OK */).send(app.locals.posts);
});

// read one post
app.get("/api/posts/:id", (req, res) => {
    const req_id = req.params.id;
    /* find the requested post in our post array */
    const post_to_read = app.locals.posts.find(post => post._id == req_id);
    if (!post_to_read) {
        /* no post is matching the requested id, return a 404 Not Found HTTP
           status */
        res.status(404 /* Not Found */).send();
    } else {
        /* we found the requested post, send it. If we don't set the HTTP
           status explicitely, the default value is 200 OK. */
        res.send(post_to_read);
    }
});

// update
app.put("/api/posts/:id", (req, res) => {
    const req_id = req.params.id;
    const updated_post = req.body;
    const index = app.locals.posts.findIndex(post => post._id == req_id);
    if (index === -1) {
        res.status(404 /* Not Found */).send();
    } else if (updated_post._id != req_id) {
        /* here the client sent a suspicious request, providing an id on the
           path that doesn't match the id from the request body. */
        res.status(400 /* Bad Request */).send();
    } else {
        /* replace the "old post" by updated_post and send the updated version */
        app.locals.posts[index] = updated_post;
        res.send(updated_post);
    }
});

// partial update
app.patch("/api/posts/:id", (req, res) => {
    const req_id = req.params.id;
    const partial = req.body;
    const post_to_update = app.locals.posts.find(post => post._id == req_id);
    if (!post_to_update) {
        res.status(404 /* Not Found */).send();
    } else if ('_id' in partial && partial._id != req_id) {
        res.status(400 /* Bad Request */).send();
    } else {
        /* replace each values from post_to_update with the requested ones */
        for (let key in partial)
            post_to_update[key] = partial[key];
        res.send(post_to_update);
    }
});

// destroy
app.delete("/api/posts/:id", (req, res) => {
    const req_id = req.params.id;
    const index = app.locals.posts.findIndex(post => post._id == req_id);
    if (index === -1)
        res.status(404 /* Not Found */).send();
    else {
        /* we save the post in a variable, so that we can send it after it has
           been deleted */
        const victim = app.locals.posts[index];
        /* remove 1 item from the array at the index `index' */
        app.locals.posts.splice(index, 1);
        res.send(victim);
    }
});

// launch our application
app.listen(app.locals.port, function () {
    console.log(app.locals.name + ' listening on port ' + app.locals.port);
});
