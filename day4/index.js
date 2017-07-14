/*
 * YABE application launcher.
 */
"use strict";

const app = require("./app");

// connect our app to the MongoDB database.
app.locals.connect().then(() => {
    console.log(app.locals.name + ' connected to MongoDB');

    // listen to the configured port for incoming requests.
    const port = app.locals.config.server.port;
    app.listen(port, function () {
        console.log(app.locals.name + ' listening on port ' + port);
    });
}).catch(err => {
    console.error(err.message);
});
