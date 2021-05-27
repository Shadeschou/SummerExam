"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRegistrationModel = void 0;
const mongoose_1 = require("mongoose");
const ILocationRegistration = new mongoose_1.Schema({
    regId: { type: Number },
    eventRegId: { type: Number },
    locationTime: { type: Date },
    longtitude: { type: Date, },
    latitude: { type: String },
    racePointNumber: { type: Number },
    raceScore: { type: Date },
    finishTime: { type: Date }
});
exports.LocationRegistrationModel = mongoose_1.model('LocationRegistration', ILocationRegistration);
//# sourceMappingURL=locationRegistration.js.map