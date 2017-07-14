/*
 * YABE - Authentication & Authorization
 */
const passport = require("passport");

module.exports = {
    basic: () => passport.authenticate('basic', {session: false}),
};
