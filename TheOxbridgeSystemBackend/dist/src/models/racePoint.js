"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RacePointModel = void 0;
var mongoose_1 = require("mongoose");
var RacePointSchema = new mongoose_1.Schema({
    racePointId: { type: Number },
    type: { type: String },
    firstsecondeventId: { type: Number },
    firsteventId: { type: Number },
    secondsecondeventId: { type: Number },
    secondeventId: { type: Number },
    eventId: { type: Number },
    racePointNumber: { type: Number }
});
exports.RacePointModel = mongoose_1.model('RacePoint', RacePointSchema);
//# sourceMappingURL=racePoint.js.map