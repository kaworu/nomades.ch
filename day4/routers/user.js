/*
 * YABE - User router
 */
"use strict";

const express = require("express");
const auth    = require("../auth");
/* our applications modules */
const User = require("../models/user");

const router = new express.Router();

/* when we see the uid parameter, set res.locals.user to the User found in the
   database or return a 404 Not Found directly. */
router.param('uid', (req, res, next, uid) => {
    User.findById(uid).then(user => {
        if (!user) {
            return res.status(404 /* Not Found */).send();
        } else {
            res.locals.user = user;
            return next();
        }
    }).catch(next);
});

// create a user
router.post("/", (req, res, next) => {
    User.create(req.body).then(created => {
        return res.status(201 /* Created */).send(created);
    }).catch(err => {
        if (err.name === 'ValidationError') {
            return res.status(400 /* Bad Request */).send({
                message: err.message
            });
        }
        return next(err);
    });
});

// read all the users
router.get("/", (req, res, next) => {
    User.find({}).then(results => {
        return res.send(results);
    }).catch(next);
});

// read a user
router.get("/:uid", (req, res, next) => {
    const user = res.locals.user;
    return res.send(user);
});

router.post("/:uid/actions/set-password", (req, res, next) => {
    const password = req.body.password;
    const user = res.locals.user;
    if (user.hash)
        return res.send(400 /* Bad Request */);
    user.resetPassword(password).then(() => {
        res.status(200 /* OK */).send();
    }).catch(next);
});

// change a user's password
router.post("/:uid/actions/reset-password", auth.basic(), function (req, res, next) {
    const logged_in = req.user;
    const target = res.locals.user;
    console.dir(logged_in.toJSON(), {colors: true});
    console.dir(target.toJSON(), {colors: true});
    if (logged_in._id.toString() === target._id.toString())
        return next();
    else
        res.status(403 /* Forbidden */).end();
}, (req, res, next) => {
    const password = req.body.password;
    const user = res.locals.user;
    user.resetPassword(password).then(() => {
        res.status(200 /* OK */).send();
    }).catch(next);
});


// delete a user
router.delete("/:uid", auth.basic(), function (req, res, next) {
    const logged_in = req.user;
    const target = res.locals.user;
    if (logged_in._id.toString() === target._id.toString())
        return next();
    else
        res.status(403 /* Forbidden */).end();
}, (req, res, next) => {
    const user = res.locals.user;
    user.remove().then(removed => res.send(removed)).catch(next);
});

// expose our router to require()
module.exports = router;
