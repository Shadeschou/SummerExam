"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Broadcast = void 0;
var mongoose_1 = require("mongoose");
var BroadcastSchema = new mongoose_1.Schema({
    eventId: { type: Number },
    message: { type: String },
    emailUsername: { type: String },
});
var Broadcast = mongoose_1.model('Broadcast', BroadcastSchema);
exports.Broadcast = Broadcast;
//# sourceMappingURL=broadcast.js.map