import {app} from "./src/server";
import {EventModel} from "./src/models/event";

const port = 3000;

const server = app.listen(port, () => {

    console.log('This server is listening at port:' + process.env.PORT);

});
