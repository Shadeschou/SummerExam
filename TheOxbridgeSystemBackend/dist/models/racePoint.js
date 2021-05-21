"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.RacePointModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    racePointId: {type: Number},
    type: {type: String},
    firstsecondeventId: {type: Number},
    firsteventId: {type: Number},
    secondsecondeventId: {type: Number},
    secondeventId: {type: Number},
    eventId: {type: Number},
    racePointNumber: {type: Number}
});
exports.RacePointModel = mongoose_1.model('racePoint', schema);
//# sourceMappingURL=racePoint.js.map