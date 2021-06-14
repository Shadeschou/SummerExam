"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var mongoose_1 = require("mongoose");
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var event_1 = require("./models/event");
var authentication_controller_1 = require("./controllers/authentication.controller");
var eventRegistration_1 = require("./models/eventRegistration");
var racePoint_1 = require("./models/racePoint");
var accessToken_controller_1 = require("./controllers/accessToken.controller");
var ship_1 = require("./models/ship");
var user_1 = require("./models/user");
var jwt = __importStar(require("jsonwebtoken"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var validate_controller_1 = require("./controllers/validate.controller");
var locationRegistration_1 = require("./models/locationRegistration");
var bcrypt_nodejs_1 = __importDefault(require("bcrypt-nodejs"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var nodemailer_1 = __importDefault(require("nodemailer"));
var crypto = __importStar(require("crypto"));
var checkEvents_1 = require("./controllers/checkEvents");
checkEvents_1.timerForTheReminder();
dotenv_1.default.config({ path: 'configs/config.env' });
var app = express_1.default();
exports.app = app;
app.use(cookie_parser_1.default(process.env.TOKEN_SECRET));
app.use(cors_1.default());
var router = express_1.default.Router();
var urlencode = body_parser_1.default.urlencoded({ extended: true });
app.use(express_1.default.static('public'));
app.use(body_parser_1.default.json());
mongoose_1.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
// ROUTING
// TO PROCESS THE NEXT REQUEST !!
router.use(function (req, res, next) {
    console.log("recieved a request now, ready for the next");
    next();
});
app.use('/', router);
// FINDALL
app.get('/events', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var events, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, event_1.EventModel.find({}, { _id: 0, __v: 0 })];
            case 1:
                events = _a.sent();
                res.status(201).json(events);
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                res.status(400).send('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/*
starting the scheduler - To check if the events are due in 3 days
 */
// POST EVENT
app.post('/events', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, event_2, one, lastEvent, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "admin")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                event_2 = new event_1.EventModel(req.body);
                one = 1;
                return [4 /*yield*/, event_1.EventModel.findOne({}).sort('desc')];
            case 2:
                lastEvent = _a.sent();
                if (lastEvent) {
                    event_2.eventId = lastEvent.eventId + one;
                }
                else {
                    event_2.eventId = 1;
                }
                // Saving the new Event in the DB
                return [4 /*yield*/, event_2.save()];
            case 3:
                // Saving the new Event in the DB
                _a.sent();
                res.status(201).json(event_2);
                return [3 /*break*/, 5];
            case 4:
                e_2 = _a.sent();
                res.status(400).send('BAD REQUEST');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// FIND SINGLE EVENT
app.get('/events/:eventId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var evId, event_3, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                evId = req.params.eventId;
                return [4 /*yield*/, event_1.EventModel.findOne({ eventId: evId }, { _id: 0, __v: 0 })];
            case 1:
                event_3 = _a.sent();
                if (!event_3) {
                    res.status(400).send('Event not found');
                }
                else {
                    res.status(200).send(event_3);
                }
                return [3 /*break*/, 3];
            case 2:
                e_3 = _a.sent();
                res.status(400).send('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// UPDATE EVENT
app.put('/events/:eventId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, newEvent, evId, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "admin")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                newEvent = req.body;
                evId = req.params.eventId;
                newEvent.eventId = req.params.eventId;
                event_1.EventModel.updateOne({ eventId: evId }, newEvent);
                res.status(202).json(newEvent);
                return [3 /*break*/, 3];
            case 2:
                e_4 = _a.sent();
                res.status(400).send('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.delete('/events/:eventId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, evId, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "admin")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                evId = req.params.eventId;
                // Finding and the deleting the event with the given eventId
                event_1.EventModel.findOneAndDelete({ eventId: evId });
                // Finding and deleting every EventRegistration with the given eventId
                eventRegistration_1.EventRegistrationModel.deleteMany({ eventId: evId });
                // Finding and deleting every RacePoint with the given eventId
                racePoint_1.RacePointModel.deleteMany({ eventId: evId });
                res.status(202).send('Event deleted');
                return [3 /*break*/, 3];
            case 2:
                e_5 = _a.sent();
                res.status(400).send('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Updating event property "isLive" to true
app.put('/events/startEvent/:eventId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, evId, updatedEvent, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "admin")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                evId = req.params.eventId;
                updatedEvent = { isLive: true, actualEventStart: req.body.actualEventStart };
                event_1.EventModel.findOneAndUpdate({ eventId: evId }, updatedEvent, { new: true });
                res.status(202).send('Event is now Live');
                return [3 /*break*/, 3];
            case 2:
                e_6 = _a.sent();
                res.status(400).send('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/events/stopEvent/:eventId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, evId, e_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "admin")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                evId = req.params.eventId;
                event_1.EventModel.findOneAndUpdate({ eventId: evId }, { isLive: false }, { new: true });
                res.status(202).send('Event Stopped');
                return [3 /*break*/, 3];
            case 2:
                e_7 = _a.sent();
                res.status(400).send('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/events/hasRoute/:eventId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var evId, racepoints, e_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                evId = req.params.eventId;
                return [4 /*yield*/, racePoint_1.RacePointModel.find({ eventId: evId }, { _id: 0, __v: 0 })];
            case 1:
                racepoints = _a.sent();
                if (racepoints && racepoints.length !== 0)
                    return [2 /*return*/, res.status(200).send(true)];
                else
                    return [2 /*return*/, res.status(200).send(false)];
                return [3 /*break*/, 3];
            case 2:
                e_8 = _a.sent();
                res.status(400).send('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/events/myEvents/findFromUsername', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, events_1, token, user, ships, e_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "admin")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                events_1 = [];
                token = req.header('x-access-token');
                user = accessToken_controller_1.AccessToken.getUser(token);
                return [4 /*yield*/, ship_1.ShipModel.find({ emailUsername: user.emailUsername }, { _id: 0, __v: 0 })];
            case 2:
                ships = _a.sent();
                if (ships.length > 0) {
                    // Finding all eventRegistrations with a ship that the user owns
                    ships.forEach(function (ship) { return __awaiter(void 0, void 0, void 0, function () {
                        var eventRegistrations;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, eventRegistration_1.EventRegistrationModel.find({ shipId: ship.shipId }, {
                                        _id: 0,
                                        __v: 0
                                    })];
                                case 1:
                                    eventRegistrations = _a.sent();
                                    if (eventRegistrations) {
                                        eventRegistrations.forEach(function (eventRegistration) { return __awaiter(void 0, void 0, void 0, function () {
                                            var event_4;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, ship_1.ShipModel.findOne({ shipId: eventRegistration.shipId }, { _id: 0, __v: 0 })];
                                                    case 1:
                                                        ship = _a.sent();
                                                        if (!ship) return [3 /*break*/, 3];
                                                        return [4 /*yield*/, event_1.EventModel.findOne({ eventId: eventRegistration.eventId }, {
                                                                _id: 0,
                                                                __v: 0
                                                            })];
                                                    case 2:
                                                        event_4 = _a.sent();
                                                        if (event_4) {
                                                            events_1.push({
                                                                "eventId": event_4.eventId,
                                                                "name": event_4.name,
                                                                "eventStart": event_4.eventStart,
                                                                "eventEnd": event_4.eventEnd,
                                                                "city": event_4.city,
                                                                "eventRegId": eventRegistration.eventRegId,
                                                                "shipName": ship.name,
                                                                "teamName": eventRegistration.teamName,
                                                                "isLive": event_4.isLive,
                                                                "actualEventStart": event_4.actualEventStart
                                                            });
                                                        }
                                                        _a.label = 3;
                                                    case 3: return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                res.status(200).send(events_1);
                return [3 /*break*/, 4];
            case 3:
                e_9 = _a.sent();
                res.status(400).send('BAD REQUEST');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Create a new ship
app.post('/ships', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, ship, one, lastShip, e_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "user")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                ship = new ship_1.ShipModel(req.body);
                one = 1;
                return [4 /*yield*/, ship_1.ShipModel.findOne({}, { _id: 0, __v: 0 }, { sort: { shipId: -1 } })];
            case 2:
                lastShip = _a.sent();
                if (lastShip)
                    ship.shipId = lastShip.shipId + one;
                else
                    ship.shipId = 1;
                // Saving the new ship in the DB
                return [4 /*yield*/, ship.save()];
            case 3:
                // Saving the new ship in the DB
                _a.sent();
                res.status(201).json(ship);
                return [3 /*break*/, 5];
            case 4:
                e_10 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Retrieve all ships
app.get('/ships', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ships, e_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ship_1.ShipModel.find({}, { _id: 0, __v: 0 })];
            case 1:
                ships = _a.sent();
                res.status(200).json(ships);
                return [3 /*break*/, 3];
            case 2:
                e_11 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Retrieve a single ship
app.get('/ships/:shipId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sId, ship, e_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                sId = req.params.shipId;
                return [4 /*yield*/, ship_1.ShipModel.findOne({ shipId: sId }, { _id: 0, __v: 0 })];
            case 1:
                ship = _a.sent();
                if (!ship)
                    return [2 /*return*/, res.status(404).send({ message: "Ship with id " + req.params.shipId + " was not found" })];
                res.status(200).send({ "name": ship.name, "shipId": ship.shipId, "emailUsername": ship.emailUsername });
                return [3 /*break*/, 3];
            case 2:
                e_12 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Retrieve all ships participating in the given event
app.get('/ships/fromEventId/:eventId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var evId, ships_1, eventRegistrations, e_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                evId = req.params.eventId;
                ships_1 = [];
                return [4 /*yield*/, eventRegistration_1.EventRegistrationModel.find({ eventId: evId }, {
                        _id: 0,
                        __v: 0
                    })];
            case 1:
                eventRegistrations = _a.sent();
                if (eventRegistrations.length !== 0) {
                    eventRegistrations.forEach(function (eventRegistration) { return __awaiter(void 0, void 0, void 0, function () {
                        var ship;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, ship_1.ShipModel.findOne({ shipId: eventRegistration.shipId }, { _id: 0, __v: 0 })];
                                case 1:
                                    ship = _a.sent();
                                    if (ship) {
                                        ships_1.push({ "shipId": ship.shipId, "name": ship.name, "teamName": eventRegistration.teamName });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                res.status(200).json(ships_1);
                return [3 /*break*/, 3];
            case 2:
                e_13 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Retrieve all user ships
app.get('/ships/myShips/fromUsername', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, user, ships, e_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                token = req.header('x-access-token');
                user = accessToken_controller_1.AccessToken.getUser(token);
                return [4 /*yield*/, ship_1.ShipModel.find({ emailUsername: user.id }, { _id: 0, __v: 0 })];
            case 1:
                ships = _a.sent();
                res.status(200).send(ships);
                return [3 /*break*/, 3];
            case 2:
                e_14 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update a ship
app.put('/ships/:shipId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, newShip, sId, ship, e_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "admin")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                newShip = new ship_1.ShipModel(req.body);
                sId = req.params.shipId;
                return [4 /*yield*/, ship_1.ShipModel.findOneAndUpdate({ shipId: sId }, newShip)];
            case 2:
                ship = _a.sent();
                if (!ship)
                    return [2 /*return*/, res.status(404).send({ message: "Ship not found with shipId " + req.params.shipId })];
                res.status(202).json(ship);
                return [3 /*break*/, 4];
            case 3:
                e_15 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Delete a ship
app.delete('/ships/:shipId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sId, ship, e_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                sId = req.params.shipId;
                return [4 /*yield*/, ship_1.ShipModel.findOneAndDelete({ shipId: sId })];
            case 1:
                ship = _a.sent();
                if (!ship)
                    return [2 /*return*/, res.status(404).send({ message: "Ship not found with shipId " + req.params.shipId })];
                res.status(202).json(ship);
                return [3 /*break*/, 3];
            case 2:
                e_16 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Retrieve start and finish racepoints from an specific event
app.get('/racePoints/findStartAndFinish/:eventId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var evId, racePoints, e_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                evId = req.params.eventId;
                return [4 /*yield*/, racePoint_1.RacePointModel.find({
                        eventId: evId,
                        $or: [{ type: 'startLine' }, { type: 'finishLine' }]
                    }, { _id: 0, __v: 0 })];
            case 1:
                racePoints = _a.sent();
                res.status(200).json(racePoints);
                return [3 /*break*/, 3];
            case 2:
                e_17 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Retrieve all racepoints from an specific event
app.get('/racepoints/fromEventId/:eventId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var evId, racePoints;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                evId = req.params.eventId;
                return [4 /*yield*/, racePoint_1.RacePointModel.find({ eventId: evId }, {
                        _id: 0,
                        __v: 0
                    }, { sort: { racePointNumber: 1 } })];
            case 1:
                racePoints = _a.sent();
                return [2 /*return*/, res.status(200).send(racePoints)];
        }
    });
}); });
// Creates a new route of racepoints for an event
app.post('/racepoints/createRoute/:eventId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, evId, racePoints_1, lastRacePoint, racepointId_1, lastRaceP, e_18;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "admin")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                evId = req.params.eventId;
                racePoint_1.RacePointModel.deleteMany({ eventId: evId });
                racePoints_1 = req.body;
                if (!Array.isArray(racePoints_1)) return [3 /*break*/, 3];
                return [4 /*yield*/, racePoint_1.RacePointModel.findOne({}, {}, { sort: { racePointId: -1 } })];
            case 2:
                lastRacePoint = _a.sent();
                lastRaceP = lastRacePoint.racePointId;
                if (lastRacePoint)
                    racepointId_1 = lastRaceP;
                else
                    racepointId_1 = 1;
                racePoints_1.forEach(function (racePoint) { return __awaiter(void 0, void 0, void 0, function () {
                    var racepoint;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                racepoint = new racePoint_1.RacePointModel(racePoint);
                                racepointId_1 = racepointId_1 + 1;
                                racepoint.racePointId = racepointId_1;
                                // Saving the new racepoint in the DB
                                return [4 /*yield*/, racepoint.save()];
                            case 1:
                                // Saving the new racepoint in the DB
                                _a.sent();
                                res.status(201).json(racePoints_1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [3 /*break*/, 4];
            case 3: return [2 /*return*/, res.status(400).send()];
            case 4: return [3 /*break*/, 6];
            case 5:
                e_18 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Retrieve all Users
app.get('/users', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, users, e_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "admin")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                return [4 /*yield*/, user_1.UserModel.find({}, { _id: 0, __v: 0 })];
            case 2:
                users = _a.sent();
                res.status(200).json(users);
                return [3 /*break*/, 4];
            case 3:
                e_19 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Retrieve a single User with the given emailUsername
app.get('/users/:userName', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, e_20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_1.UserModel.findOne({ emailUsername: req.params.emailUsername }, { _id: 0, __v: 0 })];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).send({ message: "User not found with userName " + req.params.emailUsername })];
                res.status(200).send(user);
                return [3 /*break*/, 3];
            case 2:
                e_20 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update a User with the given emailUsername
app.put('/users/:userName', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedPassword, userLoginIn, user, e_21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                // Updating the user
                console.log(req.body.password);
                return [4 /*yield*/, bcrypt_nodejs_1.default.hashSync(req.body.password)];
            case 1:
                hashedPassword = _a.sent();
                userLoginIn = req.params.userName;
                return [4 /*yield*/, user_1.UserModel.findOne({ emailUsername: userLoginIn })];
            case 2:
                user = _a.sent();
                console.log(req.body.firstname);
                // user.password = hashedPassword;
                user.role = user.role;
                // What Allie Did
                user_1.UserModel.findOne({ emailUsername: user.emailUsername });
                if (!!user) return [3 /*break*/, 3];
                return [2 /*return*/, res.status(404).send({ message: "User not found with id " + req.params })];
            case 3: return [4 /*yield*/, user_1.UserModel.findOneAndUpdate({ emailUsername: req.params.userName }, { password: hashedPassword, firstname: req.body.firstname, lastname: req.body.lastname, emailUsername: req.body.emailUsername })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                e_21 = _a.sent();
                res.status(400).json('Update User failed.');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// Delete a User with the given emailUsername
app.delete('/users/:userName', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, e_22;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_1.UserModel.findOneAndDelete({ emailUsername: req.params.emailUsername })];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).send({ message: "User not found with id " + req.params.emailUsername })];
                res.status(202).json(user);
                return [3 /*break*/, 3];
            case 2:
                e_22 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Register a new admin
app.post('/users/registerAdmin', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, users, hashedPassword, user, token, e_23;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "admin")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                return [4 /*yield*/, user_1.UserModel.find({ emailUsername: req.body.emailUsername })];
            case 2:
                users = _a.sent();
                if (users)
                    return [2 /*return*/, res.status(409).send({ message: "User with that username already exists" })];
                return [4 /*yield*/, bcrypt_nodejs_1.default.hashSync(req.body.password)];
            case 3:
                hashedPassword = _a.sent();
                user = new user_1.UserModel(req.body);
                user.password = hashedPassword;
                user.role = "admin";
                return [4 /*yield*/, user.save()];
            case 4:
                _a.sent();
                token = jwt.sign({ id: user.emailUsername, role: "admin" }, process.env.TOKEN_SECRET, { expiresIn: 86400 });
                res.status(201).send({ auth: true, token: token });
                return [3 /*break*/, 6];
            case 5:
                e_23 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Register a new user
app.post('/users/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var isUser, hashedPassword, user, token, e_24;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, user_1.UserModel.findOne({ emailUsername: req.body.emailUsername })];
            case 1:
                isUser = _a.sent();
                if (isUser) {
                    return [2 /*return*/, res.status(409).send({ message: "User with that username already exists" })];
                }
                return [4 /*yield*/, bcrypt_nodejs_1.default.hashSync(req.body.password)];
            case 2:
                hashedPassword = _a.sent();
                user = new user_1.UserModel(req.body);
                user.password = hashedPassword;
                user.role = "admin";
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                token = jwt.sign({ id: user.emailUsername, role: "admin" }, process.env.TOKEN_SECRET, { expiresIn: 86400 });
                res.status(201).send({ auth: true, token: token });
                return [3 /*break*/, 5];
            case 4:
                e_24 = _a.sent();
                res.status(400).json('Failed to Register user');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Login
app.post('/users/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userpw, passwordIsValid, token, e_25;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_1.UserModel.findOne({ emailUsername: req.body.emailUsername })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(403).json('Username incorrect')];
                }
                userpw = user.password;
                passwordIsValid = bcrypt_nodejs_1.default.compareSync(req.body.password, userpw);
                if (!passwordIsValid) {
                    return [2 /*return*/, res.status(401).send({ auth: false, token: null, message: "Invalid password" })];
                }
                token = jwt.sign({ id: user.emailUsername, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: 86400 });
                res.status(200).send({
                    emailUsername: user.emailUsername,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    auth: true,
                    token: token
                });
                return [3 /*break*/, 3];
            case 2:
                e_25 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/users/forgot/:emailUsername', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tempToken, newPW, hashedPassword, userLoginIn, user, transporter, info, e_26;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                tempToken = crypto.randomBytes(5);
                newPW = tempToken.toString('hex');
                return [4 /*yield*/, bcrypt_nodejs_1.default.hashSync(newPW)];
            case 1:
                hashedPassword = _a.sent();
                userLoginIn = req.params.emailUsername;
                return [4 /*yield*/, user_1.UserModel.findOne({ emailUsername: userLoginIn })];
            case 2:
                user = _a.sent();
                console.log(user.emailUsername);
                // const token: any = req.header('x-access-token');
                // const user: any = AccessToken.getUser(token);
                // user.password = hashedPassword;
                user.role = user.role;
                // What Allie Did
                console.log("Before find one : " + user.emailUsername);
                user_1.UserModel.findOne({ emailUsername: user.emailUsername });
                if (!!user) return [3 /*break*/, 3];
                return [2 /*return*/, res.status(404).send({ message: "User not found with id " + req.params })];
            case 3: return [4 /*yield*/, user_1.UserModel.findOneAndUpdate({ emailUsername: req.params.emailUsername }, { password: hashedPassword })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                transporter = nodemailer_1.default.createTransport({
                    host: "smtp.office365.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PSW,
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                console.log("Before Send" + user.emailUsername);
                info = transporter.sendMail({
                    from: '"Treggata" <aljo0025@easv365.dk>',
                    to: user.emailUsername,
                    subject: "PW Lost",
                    text: "Take this one " + newPW + " save a new one afterwards" + "/n To do so go to profile. /n Paste this password and give a new. " // text body
                    // html: "<p> some html </p>" // html in the body
                });
                console.info();
                console.log("After Send");
                res.status(202).json(user);
                return [3 /*break*/, 7];
            case 6:
                e_26 = _a.sent();
                res.status(400).json('Sent random pw failed.');
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
app.post('/eventRegistrations/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, eventRegistration, regDone, e_27;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "admin")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                eventRegistration = new eventRegistration_1.EventRegistrationModel(req.body);
                return [4 /*yield*/, validate_controller_1.Validate.createRegistration(eventRegistration, res)];
            case 2:
                regDone = _a.sent();
                if (regDone === null) {
                    return [2 /*return*/, res.status(500).send({ message: "SUCKS FOR YOU" })];
                }
                res.status(201).json(regDone);
                return [3 /*break*/, 4];
            case 3:
                e_27 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/* --------------------------------------------------------------------
*
*
*
*/
// Retrieve all eventRegistrations
app.get('/eventRegistrations/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, eventRegs, e_28;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "admin")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, eventRegistration_1.EventRegistrationModel.find({}, { _id: 0, __v: 0 })];
            case 3:
                eventRegs = _a.sent();
                res.status(200).send(eventRegs);
                return [3 /*break*/, 5];
            case 4:
                e_28 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Retrieve all eventRegistrations where the given user is a participant
var pending = 0;
app.get('/eventRegistrations/findEventRegFromUsername/:eventId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, token, user, eventRegistrations_1, shipByEmailUserName, e_29;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "admin")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                token = req.header('x-access-token');
                user = accessToken_controller_1.AccessToken.getUser(token);
                eventRegistrations_1 = [];
                return [4 /*yield*/, ship_1.ShipModel.find(user.emailUsername, {
                        _id: 0,
                        __v: 0
                    })];
            case 3:
                shipByEmailUserName = _a.sent();
                shipByEmailUserName.forEach(function (ship) { return __awaiter(void 0, void 0, void 0, function () {
                    var evId, sId, eventRegistration;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                pending++;
                                evId = req.params.eventId;
                                sId = ship.shipId;
                                return [4 /*yield*/, eventRegistration_1.EventRegistrationModel.find({
                                        eventId: evId,
                                        shipId: sId
                                    }, { _id: 0, __v: 0 })];
                            case 1:
                                eventRegistration = _a.sent();
                                pending--;
                                eventRegistrations_1.push(eventRegistration);
                                return [2 /*return*/];
                        }
                    });
                }); });
                if (eventRegistrations_1)
                    return [2 /*return*/, res.status(200).send(eventRegistrations_1)];
                return [3 /*break*/, 5];
            case 4:
                e_29 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post('/eventRegistrations/signUp', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var event_5, eventRegistration, registration, regDone, foundShip, transporter, info, e_30;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4 /*yield*/, event_1.EventModel.findOne({ eventCode: req.body.eventCode }, { _id: 0, __v: 0 })];
            case 1:
                event_5 = _a.sent();
                if (!event_5)
                    return [2 /*return*/, res.status(404).send({ message: "Wrong eventCode" })];
                if (!event_5) return [3 /*break*/, 6];
                return [4 /*yield*/, eventRegistration_1.EventRegistrationModel.findOne({
                        shipId: req.body.shipId,
                        eventId: event_5.eventId
                    }, { _id: 0, __v: 0 })];
            case 2:
                eventRegistration = _a.sent();
                if (eventRegistration)
                    return [2 /*return*/, res.status(409).send({ message: "ship already registered to this event" })];
                if (!!eventRegistration) return [3 /*break*/, 6];
                registration = new eventRegistration_1.EventRegistrationModel(req.body);
                registration.eventId = event_5.eventId;
                return [4 /*yield*/, validate_controller_1.Validate.createRegistration(registration, res)];
            case 3:
                regDone = _a.sent();
                if (regDone === null) {
                    return [2 /*return*/, res.status(500).send({ message: "creation failed" })];
                }
                return [4 /*yield*/, ship_1.ShipModel.findOne({ shipId: req.body.shipId })];
            case 4:
                foundShip = _a.sent();
                transporter = nodemailer_1.default.createTransport({
                    host: "smtp.office365.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PSW,
                    },
                });
                return [4 /*yield*/, transporter.sendMail({
                        from: '"Treggata" <aljo0025@easv365.dk>',
                        to: foundShip.emailUsername,
                        subject: "Event Participation Confirmation",
                        text: "your team - " + req.body.teamName + ", is now listed in the event " + event_5.name + ", with the boat " + foundShip.name + ".",
                    })];
            case 5:
                info = _a.sent();
                return [2 /*return*/, res.status(201).json({ message: "success" })];
            case 6: return [3 /*break*/, 8];
            case 7:
                e_30 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
app.delete('/eventRegistrations/:eventRegId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, evRegId, eventRegistration, e_31;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "all")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                evRegId = req.params.eventRegId;
                return [4 /*yield*/, eventRegistration_1.EventRegistrationModel.findOneAndDelete({ eventRegId: evRegId })];
            case 3:
                eventRegistration = _a.sent();
                if (!eventRegistration)
                    return [2 /*return*/, res.status(404).send({ message: "EventRegistration not found with eventRegId " + req.params.eventRegId })];
                res.status(202).json({ message: 'Registration Deleted' });
                return [3 /*break*/, 5];
            case 4:
                e_31 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post('/eventRegistrations/addParticipant', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, user, hashedPassword, newUser, ship, newShip, lastShip, one, newEventRegistration, regDone, newEventRegistration, regDone, e_32;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "admin")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 14, , 15]);
                return [4 /*yield*/, user_1.UserModel.findOne({ emailUsername: req.body.emailUsername }, { _id: 0, __v: 0 })];
            case 3:
                user = _a.sent();
                if (!!user) return [3 /*break*/, 6];
                return [4 /*yield*/, bcrypt_nodejs_1.default.hashSync("1234")];
            case 4:
                hashedPassword = _a.sent();
                newUser = new user_1.UserModel({
                    "emailUsername": req.body.emailUsername,
                    "firstname": req.body.firstname,
                    "lastname": req.body.lastname,
                    "password": hashedPassword,
                    "role": "user"
                });
                return [4 /*yield*/, newUser.save()];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [4 /*yield*/, ship_1.ShipModel.findOne({
                    emailUsername: req.body.emailUsername,
                    name: req.body.shipName
                }, { _id: 0, __v: 0 })];
            case 7:
                ship = _a.sent();
                if (!!ship) return [3 /*break*/, 11];
                newShip = new ship_1.ShipModel({ "name": req.body.shipName, "emailUsername": req.body.emailUsername });
                return [4 /*yield*/, ship_1.ShipModel.findOne({}, {}, { sort: { shipId: -1 } })];
            case 8:
                lastShip = _a.sent();
                one = 1;
                if (lastShip)
                    newShip.shipId = lastShip.shipId + one;
                else
                    newShip.shipId = 1;
                return [4 /*yield*/, newShip.save()];
            case 9:
                _a.sent();
                newEventRegistration = new eventRegistration_1.EventRegistrationModel({
                    "eventId": req.body.eventId,
                    "shipId": newShip.shipId,
                    "trackColor": "Blue",
                    "teamName": req.body.teamName
                });
                return [4 /*yield*/, validate_controller_1.Validate.createRegistration(newEventRegistration, res)];
            case 10:
                regDone = _a.sent();
                res.status(201).json(regDone);
                return [3 /*break*/, 13];
            case 11:
                newEventRegistration = new eventRegistration_1.EventRegistrationModel({
                    "eventId": req.body.eventId,
                    "shipId": ship.shipId,
                    "trackColor": "Blue",
                    "teamName": req.body.teamName
                });
                return [4 /*yield*/, validate_controller_1.Validate.createRegistration(newEventRegistration, res)];
            case 12:
                regDone = _a.sent();
                res.status(201).json(regDone);
                _a.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                e_32 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); });
app.get('/eventRegistrations/getParticipants/:eventId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var participants_1, evId, eventRegs, e_33;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                participants_1 = [];
                evId = req.params.eventId;
                return [4 /*yield*/, eventRegistration_1.EventRegistrationModel.find({ eventId: evId }, { _id: 0, __v: 0 })];
            case 1:
                eventRegs = _a.sent();
                if (!eventRegs || eventRegs.length === 0)
                    return [2 /*return*/, res.status(404).send({ message: "No participants found" })];
                eventRegs.forEach(function (eventRegistration) { return __awaiter(void 0, void 0, void 0, function () {
                    var ship, user, participant;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, ship_1.ShipModel.findOne({ shipId: eventRegistration.shipId }, { _id: 0, __v: 0 })];
                            case 1:
                                ship = _a.sent();
                                if (!!ship) return [3 /*break*/, 2];
                                return [2 /*return*/, res.status(404).send({ message: "Ship not found" })];
                            case 2:
                                if (!ship) return [3 /*break*/, 4];
                                return [4 /*yield*/, user_1.UserModel.findOne({ emailUsername: ship.emailUsername }, { _id: 0, __v: 0 })];
                            case 3:
                                user = _a.sent();
                                if (!user)
                                    return [2 /*return*/, res.status(404).send({ message: "User not found" })];
                                if (user) {
                                    participant = {
                                        "firstname": user.firstname,
                                        "lastname": user.lastname,
                                        "shipName": ship.name,
                                        "teamName": eventRegistration.teamName,
                                        "emailUsername": user.emailUsername,
                                        "eventRegId": eventRegistration.eventRegId
                                    };
                                    participants_1.push(participant);
                                    return [2 /*return*/, res.status(200).json(participants_1)];
                                }
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [3 /*break*/, 3];
            case 2:
                e_33 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put('/eventRegistrations/updateParticipant/:eventRegId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, evRegId, eventReg, ship, user, e_34;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "admin")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 10, , 11]);
                evRegId = req.params.eventRegId;
                return [4 /*yield*/, eventRegistration_1.EventRegistrationModel.findOneAndUpdate({ eventRegId: evRegId }, req.body)];
            case 3:
                eventReg = _a.sent();
                if (!eventReg) return [3 /*break*/, 8];
                return [4 /*yield*/, ship_1.ShipModel.findOneAndUpdate({ shipId: eventReg.shipId }, req.body)];
            case 4:
                ship = _a.sent();
                if (!ship) return [3 /*break*/, 6];
                return [4 /*yield*/, user_1.UserModel.findOneAndUpdate({ emailUsername: ship.emailUsername }, req.body)];
            case 5:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).send({ message: "User not found with emailUsername " + ship.emailUsername })];
                else
                    return [2 /*return*/, res.status(200).send({ updated: "true" })];
                return [3 /*break*/, 7];
            case 6: return [2 /*return*/, res.status(404).send({ message: "Ship not found with shipId " + eventReg.shipId })];
            case 7: return [3 /*break*/, 9];
            case 8: return [2 /*return*/, res.status(404).send({ message: "EventRegistration not found with eventRegId " + req.params.eventRegId })];
            case 9: return [3 /*break*/, 11];
            case 10:
                e_34 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
app.post('/locationRegistrations/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var locationRegistration, val, locationReg, one, lastRegistration, e_35;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                locationRegistration = req.body;
                return [4 /*yield*/, validate_controller_1.Validate.validateLocationForeignKeys(locationRegistration, res)];
            case 1:
                val = _a.sent();
                if (!val) {
                    return [2 /*return*/, res.status(400).send({ message: 'Could not create' })];
                }
                // Finding next regId
                locationRegistration.locationTime.setHours(locationRegistration.locationTime.getHours() + 2);
                return [4 /*yield*/, validate_controller_1.Validate.CheckRacePoint(locationRegistration, res)];
            case 2:
                locationReg = _a.sent();
                if (locationReg) {
                    locationRegistration = locationReg;
                }
                one = 1;
                return [4 /*yield*/, locationRegistration_1.LocationRegistrationModel.findOne({}).sort('-desc')];
            case 3:
                lastRegistration = _a.sent();
                if (lastRegistration)
                    locationRegistration.regId = lastRegistration.regId + one;
                else
                    locationRegistration.regId = 1;
                return [4 /*yield*/, locationRegistration.save()];
            case 4:
                _a.sent();
                return [2 /*return*/, res.status(201).json(locationRegistration)];
            case 5:
                e_35 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.get('/locationRegistrations/getLive/:eventId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var evId, eventRegistrations, fewRegistrations_1, i, e_36;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                evId = req.params.eventId;
                return [4 /*yield*/, eventRegistration_1.EventRegistrationModel.find({ eventId: evId }, {
                        _id: 0,
                        __v: 0
                    })];
            case 1:
                eventRegistrations = _a.sent();
                fewRegistrations_1 = [];
                eventRegistrations.forEach(function (eventRegistration) { return __awaiter(void 0, void 0, void 0, function () {
                    var locationRegistration, boatLocations;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, locationRegistration_1.LocationRegistrationModel.find({ eventRegId: eventRegistration.eventRegId }, {
                                    _id: 0,
                                    __v: 0
                                }, { sort: { 'locationTime': -1 }, limit: 20 })];
                            case 1:
                                locationRegistration = _a.sent();
                                if (locationRegistration.length !== 0) {
                                    boatLocations = {
                                        "locationsRegistrations": locationRegistration,
                                        "color": eventRegistration.trackColor,
                                        "shipId": eventRegistration.shipId,
                                        "teamName": eventRegistration.teamName
                                    };
                                    fewRegistrations_1.push(boatLocations);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                if (fewRegistrations_1.length !== 0) {
                    if (fewRegistrations_1[0].locationsRegistrations[0].raceScore !== 0) {
                        fewRegistrations_1.sort(function (a, b) { return (a.locationsRegistrations[0].raceScore >= b.locationsRegistrations[0].raceScore) ? -1 : 1; });
                        for (i = 0; i < fewRegistrations_1.length; i++) {
                            fewRegistrations_1[i].placement = i + 1;
                        }
                    }
                    else {
                        fewRegistrations_1.sort(function (a, b) { return (a.shipId > b.shipId) ? 1 : -1; });
                    }
                }
                return [2 /*return*/, res.status(200).json(fewRegistrations_1)];
            case 2:
                e_36 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/locationRegistrations/getReplay/:eventId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var evId, eventRegistrations, shipLocations_1, e_37;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                evId = req.params.eventId;
                return [4 /*yield*/, eventRegistration_1.EventRegistrationModel.find({ eventId: evId }, {
                        _id: 0,
                        __v: 0
                    })];
            case 1:
                eventRegistrations = _a.sent();
                if (eventRegistrations.length !== 0) {
                    shipLocations_1 = [];
                    eventRegistrations.forEach(function (eventRegistration) { return __awaiter(void 0, void 0, void 0, function () {
                        var locationRegistrations, shipLocation;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, locationRegistration_1.LocationRegistrationModel.find({ eventRegId: eventRegistration.eventRegId }, {
                                        _id: 0,
                                        __v: 0
                                    }, { sort: { 'locationTime': 1 } })];
                                case 1:
                                    locationRegistrations = _a.sent();
                                    if (locationRegistrations) {
                                        shipLocation = {
                                            "locationsRegistrations": locationRegistrations,
                                            "color": eventRegistration.trackColor,
                                            "shipId": eventRegistration.shipId,
                                            "teamName": eventRegistration.teamName
                                        };
                                        shipLocations_1.push(shipLocation);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/, res.status(200).send(shipLocations_1)];
                }
                else {
                    return [2 /*return*/, res.status(200).send(eventRegistrations)];
                }
                return [3 /*break*/, 3];
            case 2:
                e_37 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/locationRegistrations/getScoreboard/:eventId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var evId, eventRegistrations, scores_1, i, e_38;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                evId = req.params.eventId;
                return [4 /*yield*/, eventRegistration_1.EventRegistrationModel.find({ eventId: evId }, {
                        _id: 0,
                        __v: 0
                    })];
            case 1:
                eventRegistrations = _a.sent();
                scores_1 = [];
                if (eventRegistrations.length !== 0) {
                    eventRegistrations.forEach(function (eventReg) { return __awaiter(void 0, void 0, void 0, function () {
                        var locationRegistration, ship, user, score;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, locationRegistration_1.LocationRegistrationModel.find({ eventRegId: eventReg.eventRegId }, {
                                        _id: 0,
                                        __v: 0
                                    }, { sort: { 'locationTime': -1 }, limit: 1 })];
                                case 1:
                                    locationRegistration = _a.sent();
                                    if (!(locationRegistration.length !== 0)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, ship_1.ShipModel.findOne({ shipId: eventReg.shipId }, { _id: 0, __v: 0 })];
                                case 2:
                                    ship = _a.sent();
                                    return [4 /*yield*/, user_1.UserModel.findOne({ emailUsername: ship.emailUsername }, { _id: 0, __v: 0 })];
                                case 3:
                                    user = _a.sent();
                                    if (user) {
                                        score = {
                                            "locationsRegistrations": locationRegistration,
                                            "color": eventReg.trackColor,
                                            "shipId": eventReg.shipId,
                                            "shipName": ship.name,
                                            "teamName": eventReg.teamName,
                                            "owner": user.firstname + " " + user.lastname
                                        };
                                        scores_1.push(score);
                                    }
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    if (scores_1.length !== 0) {
                        if (scores_1[0].locationsRegistrations[0].raceScore !== 0) {
                            scores_1.sort(function (a, b) { return (a.locationsRegistrations[0].raceScore >= b.locationsRegistrations[0].raceScore) ? -1 : 1; });
                            for (i = 0; i < scores_1.length; i++) {
                                scores_1[i].placement = i + 1;
                            }
                        }
                        else {
                            scores_1.sort(function (a, b) { return (a.shipId > b.shipId) ? 1 : -1; });
                        }
                    }
                }
                return [2 /*return*/, res.status(200).send(scores_1)];
            case 2:
                e_38 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.delete('/locationRegistrations/deleteFromEventRegId/:eventId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var verify, evRegId, e_39;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, authentication_controller_1.Auth.Authorize(req, res, "user")];
            case 1:
                verify = _a.sent();
                if (!verify) {
                    return [2 /*return*/, res.status(400).send({ auth: false, message: 'Not Authorized' })];
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                evRegId = req.params.eventRegId;
                return [4 /*yield*/, locationRegistration_1.LocationRegistrationModel.deleteMany({ eventRegId: evRegId }, {})];
            case 3:
                _a.sent();
                res.status(202).json('Deleted');
                return [3 /*break*/, 5];
            case 4:
                e_39 = _a.sent();
                res.status(400).json('BAD REQUEST');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.get('*', function (req, res) {
    return res.status(400).send('Page Not Found');
});
//# sourceMappingURL=server.js.map