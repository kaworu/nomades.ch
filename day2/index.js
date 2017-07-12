/*
 * YABE launcher.
 */
"use strict";

const app = require("./app");

// launch our application
app.listen(app.locals.port, function () {
    console.log(app.locals.name + ' listening on port ' + app.locals.port);
});
