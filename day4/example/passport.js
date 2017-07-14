const express = require('express');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

const app = express();
app.use(passport.initialize());

/* authentication: Basic Auth with Passport */
passport.use(new BasicStrategy({
    realm: "Users",
}, function(username, password, done) {
        // a fake database.
        const Users = [
            {name: "alice", password: "secret"},
            {name: "bob",   password: "birthday"},
        ];
        const user = Users.find(u => u.name === username);
        if (!user)
            return done(/* no error*/null, /* authentication failed */false);
        // FIXME: do NOT verify password like this, use node-bcrypt.
        else if (user.password !== password)
            return done(/* no error*/null, /* authentication failed */false);
        else
            return done(/* no error */null, /* the authenticated user */user);
    }
/* Mongoose example: */
// User.findOne({name: username}).catch(done).then(user => {
//     if (!user)
//         return done(/* no error*/null, /* authentication failed */false);
//     bcrypt.compare(password, user.hash).then(success => {
//         if (success)
//            return done(/* no error */null, /* the authenticated user */user);
//         else
//            return done(/* no error*/null, /* authentication failed */false);
//     });
// });
));

/* authorization: custom Middleware factory */
function authorize(username) {
    return function (req, res, next) {
        if (req.user && req.user.name == username) {
            return next();
        } else {
            return res.status(403).send('Forbidden');
        }
    };
}

/* no authentication at all, regardless if the request tried to */
app.get('/no', function (req, res, next) {
    res.send("Don't know who you are " + req.user);
});

/* authentication required */
app.get('/required', passport.authenticate('basic', {session: false}), (req, res, next) => {
    res.send(`I know you, you are ${req.user.name}.\n`);
});

/* authentication required and authorization check */
app.get('/alice', passport.authenticate('basic', {session: false}), authorize('alice'), (req, res, next) => {
    res.send(`I know you and you are authorized ${req.user.name}.\n`);
});
/* authentication optional */
app.get('/optional', function (req, res, next) {
    passport.authenticate('basic', function (err, user, info) {
        if (err)
            return next(err);
        if (user)
            res.send(`Hello ${user.name}!\n`);
        else
            res.send(`Hello stranger!\n`);
    })(req, res, next);
});

app.listen(3000, function () {
  console.log('listening on port 3000!');
});
