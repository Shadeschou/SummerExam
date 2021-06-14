"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModel = void 0;
var mongoose_1 = require("mongoose");
var IEventSchema = new mongoose_1.Schema({
    eventId: { type: Number },
    name: { type: String },
    eventStart: { type: Date },
    eventEnd: { type: Date },
    city: { type: String },
    eventCode: { type: String },
    actualEventStart: { type: Date },
    isLive: { type: Boolean }
});
var EventModel = mongoose_1.model('Event', IEventSchema);
exports.EventModel = EventModel;
//# sourceMappingURL=event.js.map