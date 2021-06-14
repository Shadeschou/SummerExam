"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validate = void 0;
var event_1 = require("../models/event");
var eventRegistration_1 = require("../models/eventRegistration");
var locationRegistration_1 = require("../models/locationRegistration");
var racePoint_1 = require("../models/racePoint");
var Validate = /** @class */ (function () {
    function Validate() {
    }
    // static async validateEventForeignKeys(registration: IEventRegistration, res: express.Response): Promise<boolean> {
    //     // Checking if ship exists
    //     const ship: IShip = await ShipModel.findOne({shipId: registration.shipId})
    //     if (!ship) {
    //         return false;
    //     }
    //     // Checking if event exists
    //     const event: IEvent = await EventModel.findOne({eventId: registration.eventId});
    //     if (!event) {
    //         return false;
    //     }
    // }
    Validate.createRegistration = function (newRegistration, res) {
        return __awaiter(this, void 0, void 0, function () {
            var lastEventRegistration, one;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, eventRegistration_1.EventRegistrationModel.findOne({}, {}, { sort: { regId: -1 } })];
                    case 1:
                        lastEventRegistration = _a.sent();
                        one = 1;
                        if (lastEventRegistration)
                            newRegistration.eventRegId = lastEventRegistration.eventRegId + one;
                        else
                            newRegistration.eventRegId = 1;
                        return [4 /*yield*/, newRegistration.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, newRegistration];
                }
            });
        });
    };
    Validate.FindDistance = function (registration, racePoint) {
        var checkPoint1 = {
            longtitude: Number,
            latitude: Number
        };
        var checkPoint2 = {
            longtitude: Number,
            latitude: Number
        };
        checkPoint1.longtitude = racePoint.firstLongtitude;
        checkPoint1.latitude = racePoint.firstLatitude;
        checkPoint2.longtitude = racePoint.secondLongtitude;
        checkPoint2.latitude = racePoint.secondLatitude;
        var AB = Validate.CalculateDistance(checkPoint1, checkPoint2);
        var BC = Validate.CalculateDistance(checkPoint2, registration);
        var AC = Validate.CalculateDistance(checkPoint1, registration);
        var P = (AB + BC + AC) / 2;
        var S = Math.sqrt(P * (P - AC) * (P - AB) * (P - AC));
        var result = 2 * S / AB;
        return result;
    };
    Validate.CalculateDistance = function (checkPoint1, checkPoint2) {
        var R = 6371e3; // metres
        var φ1 = checkPoint1.latitude * Math.PI / 180; // φ, λ in radians
        var φ2 = checkPoint2.latitude * Math.PI / 180;
        var Δφ = (checkPoint2.latitude - checkPoint1.latitude) * Math.PI / 180;
        var Δλ = (checkPoint2.longtitude - checkPoint1.longtitude) * Math.PI / 180;
        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        // noinspection UnnecessaryLocalVariableJS
        var d = R * c;
        return d;
    };
    Validate.validateLocationForeignKeys = function (registration, res) {
        return __awaiter(this, void 0, void 0, function () {
            var eventReg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, eventRegistration_1.EventRegistrationModel.findOne({ eventRegId: registration.eventRegId })];
                    case 1:
                        eventReg = _a.sent();
                        if (!eventReg) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    Validate.CheckRacePoint = function (registration, res) {
        return __awaiter(this, void 0, void 0, function () {
            var eventRegistration, nextRacePointNumber, one, locationRegistration, updatedRegistration, event_2, nextRacePoint, distance, newNextRacePoint, nextPointDistance, updatedRegistration, updatedRegistration, ticks, updatedRegistration, updatedRegistration, updatedRegistration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, eventRegistration_1.EventRegistrationModel.findOne({ eventRegId: registration.eventRegId }, {
                            _id: 0,
                            __v: 0
                        })];
                    case 1:
                        eventRegistration = _a.sent();
                        nextRacePointNumber = 2;
                        one = 1;
                        return [4 /*yield*/, locationRegistration_1.LocationRegistrationModel.findOne({ eventRegId: registration.eventRegId }, {
                                _id: 0,
                                __v: 0
                            }, { sort: { 'locationTime': -1 } })];
                    case 2:
                        locationRegistration = _a.sent();
                        if (locationRegistration) {
                            nextRacePointNumber = locationRegistration.racePointNumber + one;
                            if (locationRegistration.finishTime != null) {
                                updatedRegistration = registration;
                                updatedRegistration.racePointNumber = locationRegistration.racePointNumber;
                                updatedRegistration.raceScore = locationRegistration.raceScore;
                                updatedRegistration.finishTime = locationRegistration.finishTime;
                                return [2 /*return*/, updatedRegistration];
                            }
                        }
                        if (!eventRegistration) return [3 /*break*/, 13];
                        return [4 /*yield*/, event_1.EventModel.findOne({ eventId: eventRegistration.eventId }, { _id: 0, __v: 0 })];
                    case 3:
                        event_2 = _a.sent();
                        if (!(event_2 && event_2.isLive)) return [3 /*break*/, 12];
                        return [4 /*yield*/, racePoint_1.RacePointModel.findOne({
                                eventId: eventRegistration.eventId,
                                racePointNumber: nextRacePointNumber
                            }, { _id: 0, __v: 0 })];
                    case 4:
                        nextRacePoint = _a.sent();
                        if (!nextRacePoint) return [3 /*break*/, 10];
                        distance = this.FindDistance(registration, nextRacePoint);
                        if (!(distance < 25)) return [3 /*break*/, 8];
                        if (!(nextRacePoint.type !== "finishLine")) return [3 /*break*/, 6];
                        return [4 /*yield*/, racePoint_1.RacePointModel.findOne({
                                eventId: eventRegistration.eventId,
                                racePointNumber: nextRacePoint.racePointNumber + one
                            }, { _id: 0, __v: 0 })];
                    case 5:
                        newNextRacePoint = _a.sent();
                        if (newNextRacePoint) {
                            nextPointDistance = this.FindDistance(registration, newNextRacePoint);
                            distance = nextPointDistance;
                            updatedRegistration = registration;
                            updatedRegistration.racePointNumber = nextRacePointNumber;
                            updatedRegistration.raceScore = ((nextRacePointNumber) * 10) + ((nextRacePointNumber) / distance);
                            return [2 /*return*/, updatedRegistration];
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        updatedRegistration = registration;
                        updatedRegistration.racePointNumber = nextRacePointNumber;
                        updatedRegistration.finishTime = registration.locationTime;
                        ticks = ((registration.locationTime.getTime() * 10000) + 621355968000000000);
                        updatedRegistration.raceScore = (1000000000000000000 - ticks) / 1000000000000;
                        return [2 /*return*/, updatedRegistration];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        updatedRegistration = registration;
                        updatedRegistration.racePointNumber = nextRacePointNumber - 1;
                        updatedRegistration.raceScore = ((nextRacePointNumber - 1) * 10) + ((nextRacePointNumber - 1) / distance);
                        return [2 /*return*/, updatedRegistration];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        updatedRegistration = registration;
                        updatedRegistration.racePointNumber = 1;
                        updatedRegistration.raceScore = 0;
                        return [2 /*return*/, updatedRegistration];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        updatedRegistration = registration;
                        updatedRegistration.racePointNumber = 1;
                        updatedRegistration.raceScore = 0;
                        return [2 /*return*/, updatedRegistration];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    return Validate;
}());
exports.Validate = Validate;
//# sourceMappingURL=validate.controller.js.map