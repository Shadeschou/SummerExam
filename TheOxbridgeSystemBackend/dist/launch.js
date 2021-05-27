"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const port = 3001;
const server = server_1.app.listen(port, () => {
    console.log('Running in this mode: ' + process.env.PORT);
    console.log('This server is listening at port:' + port);
});
//# sourceMappingURL=launch.js.map