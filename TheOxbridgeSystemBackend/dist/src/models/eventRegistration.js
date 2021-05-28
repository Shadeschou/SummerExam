"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRegistrationModel = void 0;
const mongoose_1 = require("mongoose");
const EventRegistrationSchema = new mongoose_1.Schema({
    eventRegId: { type: Number },
    shipId: { type: Number },
    eventId: { type: Number },
    trackColor: { type: Date },
    teamName: { type: String },
});
const EventRegistrationModel = mongoose_1.model('EventRegistration', EventRegistrationSchema);
exports.EventRegistrationModel = EventRegistrationModel;
//# sourceMappingURL=eventRegistration.js.map