"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.EventRegistrationModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    eventRegId: {type: Number},
    shipId: {type: Number},
    eventId: {type: Number},
    trackColor: {type: Date},
    teamName: {type: String},
});
exports.EventRegistrationModel = mongoose_1.model('EventRegistration', schema);
//# sourceMappingURL=eventRegistration.js.map