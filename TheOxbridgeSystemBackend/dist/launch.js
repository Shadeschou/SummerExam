"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./src/server");
var port = 3000;
var server = server_1.app.listen(port, function () {
    console.log('This server is listening at port:' + process.env.PORT);
});
//# sourceMappingURL=launch.js.map