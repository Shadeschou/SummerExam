"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRegistrationModel = void 0;
var mongoose_1 = require("mongoose");
var EventRegistrationSchema = new mongoose_1.Schema({
    eventRegId: { type: Number },
    shipId: { type: Number },
    eventId: { type: Number },
    trackColor: { type: String },
    teamName: { type: String },
    emailUsername: { type: String },
    mailRecieved: {
        type: Boolean,
        default: false
    }
});
var EventRegistrationModel = mongoose_1.model('EventRegistration', EventRegistrationSchema);
exports.EventRegistrationModel = EventRegistrationModel;
//# sourceMappingURL=eventRegistration.js.map