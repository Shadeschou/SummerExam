"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.ShipModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    shipId: {type: Number, required: false},
    emailUsername: {type: String, required: false},
    name: {type: String, required: false},
});
exports.ShipModel = mongoose_1.model('Ship', schema);
//# sourceMappingURL=ship.js.map