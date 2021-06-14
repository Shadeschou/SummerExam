"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const server_1 = require("./src/server");
const port = 3000;
const server = server_1.app.listen(port, () => {
    console.log('This server is listening at port:' + process.env.PORT);
});
//# sourceMappingURL=launch.js.map
