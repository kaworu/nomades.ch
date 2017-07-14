/*
 * YABE - User model
 *
 * Has some password dedicated logic.
 */
"use strict";

const bcrypt   = require("bcrypt");
const mongoose = require("mongoose");

const BCRYPT_COST = 4; // minimum=4

/* Schema */
const userSchema = new mongoose.Schema({
    name:  {type: String, required: true, unique: true},
    hash:  {type: String, set: val => this.hash},
});

/* authentication using bcrypt */
userSchema.statics.authenticate = function (username, password) {
    return this.findOne({name: username}).then(user => {
        if (!user)
            return false;
        return bcrypt.compare(password, user.hash).then(success => {
            return (success ? user : false);
        });
    });
};

/* set the user's password using bcrypt */
userSchema.methods.resetPassword = function (new_password) {
    return bcrypt.hash(new_password, BCRYPT_COST).then(new_hash => {
        /* here we may want to write:
         *
         * this.hash = new_hash; // will not work
         * this.save();
         *
         * but it won't work because we made the `hash' setter ignoring new
         * values. findByIdAndUpdate() will bypass the Schema setter by
         * updating the `hash' field directly in the database.
         */
        return User.findByIdAndUpdate(this._id, {$set: {hash: new_hash}});
    });
};

/* when converting to JSON, we want to hide the sensitive hash information */
userSchema.options.toJSON = {
    transform(doc, ret, options) {
        delete ret.hash;
        return ret;
    }
};

/* Model */
const User = mongoose.model('User', userSchema);

/* expose User to require() */
module.exports = User;
