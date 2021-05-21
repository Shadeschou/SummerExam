"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.EventModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    eventId: {type: Number},
    name: {type: String},
    eventStart: {type: Date},
    eventEnd: {type: Date},
    city: {type: String},
    eventCode: {type: String},
    actualEventStart: {type: Date},
    isLive: {type: Boolean}
});
exports.EventModel = mongoose_1.model('Event', schema);
//# sourceMappingURL=event.js.map