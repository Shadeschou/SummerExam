import {app} from "./src/server";
import {EventModel} from "./src/models/event";

const port = 3000;

/**
 * helper to make the server launch.
 * @param Return the status on console level that the server was successfully started.
 */
const server = app.listen(port, () => {

    console.log('This server is listening at port:' + process.env.PORT);

});
