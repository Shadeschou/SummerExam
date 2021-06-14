"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
var mongoose_1 = require("mongoose");
var UserModelSchema = new mongoose_1.Schema({
    firstname: { type: String },
    lastname: { type: String },
    emailUsername: { type: String },
    password: { type: String },
    role: { type: String, required: true }
});
exports.UserModel = mongoose_1.model('User', UserModelSchema);
//# sourceMappingURL=user.js.map