/*
 * YABE - Post model
 */
"use strict";

const mongoose = require("mongoose");

/* Schema */
const postSchema = new mongoose.Schema({
    title:  String,
    body:   String,
});

/* Model */
const Post = mongoose.model('Post', postSchema);

/* expose Post to require() */
module.exports = Post;
