"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    firstname: {type: String},
    lastname: {type: String},
    usernameMail: {type: String},
    password: {type: Number},
    role: {type: String}
});
exports.UserModel = mongoose_1.model('User', schema);
//# sourceMappingURL=user.js.map