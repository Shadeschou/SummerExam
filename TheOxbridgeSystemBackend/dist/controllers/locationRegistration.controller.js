"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const eventRegistration_1 = require("../models/eventRegistration");
const event_1 = require("../models/event");
const ship_1 = require("../models/ship");
const authentication_controller_1 = require("./authentication.controller");
const racePoint_1 = require("../models/racePoint");
const user_1 = require("../models/user");
const locationRegistration_1 = require("../models/locationRegistration");
// Create and Save a new locationRegistration
exports.create = (req, res) => {
    // Checking if authorized
    authentication_controller_1.Authorize(req, res, "user", err => {
        if (err)
            return err;
        // Creating the LocationRegistration
        const locationRegistration = new locationRegistration_1.LocationRegistrationModel(req.body);
        module.exports.createLocationRegistration(locationRegistration, res, (err, locationReg) => {
            if (err)
                return err;
            return res.status(201).json(locationReg);
        });
    });
};
// Checks that all foreignkeys are valid. Creates and save a new LocationRegistration. Returns response
exports.createLocationRegistration = (newLocationRegistration, res, callback) => {
    validateForeignKeys(newLocationRegistration, res, err => {
        if (err)
            return callback(err);
        // Finding next regId
        newLocationRegistration.locationTime.setHours(newLocationRegistration.locationTime.getHours() + 2);
        CheckRacePoint(newLocationRegistration, res, updatedRegistration => {
            if (updatedRegistration) {
                newLocationRegistration = updatedRegistration;
                locationRegistration_1.LocationRegistrationModel.findOne({}).sort('-regId').exec((err, lastRegistration) => {
                    if (err)
                        return callback(res.status(500).send({message: err.message || "Some error occurred while retriving locationRegistrations"}));
                    if (lastRegistration)
                        newLocationRegistration.regId = lastRegistration.regId + 1;
                    else
                        newLocationRegistration.regId = 1;
                    newLocationRegistration.save(function (err) {
                        if (err)
                            return callback(res.send(err));
                        return callback(null, newLocationRegistration);
                    });
                });
            }
        });
    });
};

// Updates racePoint number, if the ship has reached new racePoint and calculates the racescore
function CheckRacePoint(registration, res, callback) {
    eventRegistration_1.EventRegistrationModel.findOne({eventRegId: registration.eventRegId}, {
        _id: 0,
        __v: 0
    }, function (err, eventRegistration) {
        if (err)
            return callback(res.status(500).send({message: err.message || "Some error occurred while retriving eventRegistrations"}));
        // Checks which racepoint the ship has reached last
        let nextRacePointNumber = 2;
        locationRegistration_1.LocationRegistrationModel.findOne({eventRegId: registration.eventRegId}, {
            _id: 0,
            __v: 0
        }, {sort: {'locationTime': -1}}, (err, locationRegistration) => {
            if (err)
                return callback(res.status(500).send({message: err.message || "Some error occurred while retriving locationRegistrations"}));
            if (locationRegistration) {
                nextRacePointNumber = locationRegistration_1.LocationRegistrationModel.racePointNumber + 1;
                if (locationRegistration.finishTime != null) {
                    const updatedRegistration = registration;
                    updatedRegistration.racePointNumber = locationRegistration.racePointNumber;
                    updatedRegistration.raceScore = locationRegistration.raceScore;
                    updatedRegistration.finishTime = locationRegistration.finishTime;
                    return callback(updatedRegistration);
                }
            }
            if (eventRegistration) {
                event_1.EventModel.findOne({eventId: eventRegistration.eventId}, {_id: 0, __v: 0}, (err, event) => {
                    if (err)
                        return callback(res.status(500).send({message: err.message || "Some error occurred while retriving events"}));
                    if (event && event.isLive) {
                        // Finds the next racepoint and calculates the ships distance to the racepoint
                        // and calculates the score based on the distance
                        racePoint_1.RacePointModel.findOne({
                            eventId: eventRegistration.eventId,
                            racePointNumber: nextRacePointNumber
                        }, {_id: 0, __v: 0}, (err, nextRacePoint) => {
                            if (err)
                                return callback(res.status(500).send({message: err.message || "Some error occurred while retriving racepoints"}));
                            if (nextRacePoint) {
                                FindDistance(registration, nextRacePoint, function (distance) {
                                    if (distance < 25) {
                                        if (nextRacePoint.type != "finishLine") {
                                            racePoint_1.RacePointModel.findOne({
                                                eventId: eventRegistration.eventId,
                                                racePointNumber: nextRacePoint.racePointNumber + 1
                                            }, {_id: 0, __v: 0}, (err, newNextRacePoint) => {
                                                if (err)
                                                    return callback(res.status(500).send({message: err.message || "Some error occurred while retriving racepoints"}));
                                                if (newNextRacePoint) {
                                                    FindDistance(registration, newNextRacePoint, function (nextPointDistance) {
                                                        distance = nextPointDistance;
                                                        const updatedRegistration = registration;
                                                        updatedRegistration.racePointNumber = nextRacePointNumber;
                                                        updatedRegistration.raceScore = ((nextRacePointNumber) * 10) + ((nextRacePointNumber) / distance);
                                                        return callback(updatedRegistration);
                                                    });
                                                }
                                            });
                                        } else {
                                            const updatedRegistration = registration;
                                            updatedRegistration.racePointNumber = nextRacePointNumber;
                                            updatedRegistration.finishTime = registration.locationTime;
                                            const ticks = ((registration.locationTime.getTime() * 10000) + 621355968000000000);
                                            updatedRegistration.raceScore = (1000000000000000000 - ticks) / 1000000000000;
                                            return callback(updatedRegistration);
                                        }
                                    } else {
                                        const updatedRegistration = registration;
                                        updatedRegistration.racePointNumber = nextRacePointNumber - 1;
                                        updatedRegistration.raceScore = ((nextRacePointNumber - 1) * 10) + ((nextRacePointNumber - 1) / distance);
                                        return callback(updatedRegistration);
                                    }
                                });
                            } else {
                                const updatedRegistration = registration;
                                updatedRegistration.racePointNumber = 1;
                                updatedRegistration.raceScore = 0;
                                return callback(updatedRegistration);
                            }
                        });
                    } else {
                        const updatedRegistration = registration;
                        updatedRegistration.racePointNumber = 1;
                        updatedRegistration.raceScore = 0;
                        return callback(updatedRegistration);
                    }
                });
            }
        });
    });
}

// Finds the ships distance to the racepoint
function FindDistance(registration, racePoint, callback) {
    const checkPoint1 = {
        longtitude: null,
        latitude: null
    };
    const checkPoint2 = {
        longtitude: null,
        latitude: null
    };
    checkPoint1.longtitude = racePoint.firstLongtitude;
    checkPoint1.latitude = racePoint.firstLatitude;
    checkPoint2.longtitude = racePoint.secondLongtitude;
    checkPoint2.latitude = racePoint.secondLatitude;
    const AB = CalculateDistance(checkPoint1, checkPoint2);
    const BC = CalculateDistance(checkPoint2, registration);
    const AC = CalculateDistance(checkPoint1, registration);
    const P = (AB + BC + AC) / 2;
    const S = Math.sqrt(P * (P - AC) * (P - AB) * (P - AC));
    const result = 2 * S / AB;
    return callback(result);
}

// Calculates the closets distance from the ship to the checkpoint
function CalculateDistance(first, second) {
    const R = 6371e3; // metres
    const φ1 = first.latitude * Math.PI / 180; // φ, λ in radians
    const φ2 = second.latitude * Math.PI / 180;
    const Δφ = (second.latitude - first.latitude) * Math.PI / 180;
    const Δλ = (second.longtitude - first.longtitude) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // noinspection UnnecessaryLocalVariableJS
    const d = R * c;
    return d;
}

// Retrieve the latest locationRegistrations on all ships in specific event
let pending = 0;
exports.getLive = (req, res) => {
    eventRegistration_1.EventRegistrationModel.find({eventId: req.params.eventId}, {
        _id: 0,
        __v: 0
    }, (err, eventRegistrations) => {
        if (err) {
            return res.status(500).send({message: err.message || "Some error occurred while retriving eventRegistrations"});
        }
        const fewRegistrations = [];
        eventRegistrations.forEach(eventRegistration => {
            pending++;
            locationRegistration_1.LocationRegistrationModel.find({eventRegId: eventRegistration.eventRegId}, {
                _id: 0,
                __v: 0
            }, {sort: {'locationTime': -1}, limit: 20}, function (err, locationRegistration) {
                pending--;
                if (err) {
                    return res.status(500).send({message: err.message || "Some error occurred while retriving locationRegistrations"});
                }
                let boatLocations;
                if (locationRegistration.length != 0) {
                    boatLocations = {
                        "locationsRegistrations": locationRegistration,
                        "color": eventRegistration.trackColor,
                        "shipId": eventRegistration.shipId,
                        "teamName": eventRegistration.teamName
                    };
                    fewRegistrations.push(boatLocations);
                }
                if (pending == 0) {
                    if (fewRegistrations.length != 0) {
                        if (fewRegistrations[0].locationsRegistrations[0].raceScore != 0) {
                            fewRegistrations.sort((a, b) => (a.locationsRegistrations[0].raceScore >= b.locationsRegistrations[0].raceScore) ? -1 : 1);
                            for (let i = 0; i < fewRegistrations.length; i++) {
                                fewRegistrations[i].placement = i + 1;
                            }
                        } else {
                            fewRegistrations.sort((a, b) => (a.shipId > b.shipId) ? 1 : -1);
                        }
                    }
                    return res.status(200).json(fewRegistrations);
                }
            });
        });
    });
};
// Retrive scoreboard from event
exports.getScoreboard = (req, res) => {
    let pending = 0;
    eventRegistration_1.EventRegistrationModel.find({eventId: req.params.eventId}, {
        _id: 0,
        __v: 0
    }, (err, eventRegistrations) => {
        if (err)
            return res.status(500).send({message: err.message || "Some error occurred while retriving eventRegistrations"});
        if (eventRegistrations.length !== 0) {
            const scores = [];
            eventRegistrations.forEach(eventReg => {
                pending++;
                locationRegistration_1.LocationRegistrationModel.find({eventRegId: eventReg.eventRegId}, {
                    _id: 0,
                    __v: 0
                }, {sort: {'locationTime': -1}, limit: 1}, function (err, locationRegistration) {
                    if (err)
                        return res.status(500).send({message: err.message || "Some error occurred while retriving locationRegistrations"});
                    if (locationRegistration.length !== 0) {
                        ship_1.ShipModel.findOne({shipId: eventReg.shipId}, {_id: 0, __v: 0}, (err, ship) => {
                            if (err)
                                return res.status(500).send({message: err.message || "Some error occurred while retriving ships"});
                            user_1.UserModel.findOne({emailUsername: ship.emailUsername}, {
                                _id: 0,
                                __v: 0
                            }, (err, user) => {
                                pending--;
                                if (err)
                                    return res.status(500).send({message: err.message || "Some error occurred while retriving users"});
                                if (user) {
                                    const score = {
                                        "locationsRegistrations": locationRegistration,
                                        "color": eventReg.trackColor,
                                        "shipId": eventReg.shipId,
                                        "shipName": ship.name,
                                        "teamName": eventReg.teamName,
                                        "owner": user.firstname + " " + user.lastname
                                    };
                                    scores.push(score);
                                }
                                if (pending === 0) {
                                    if (scores.length != 0) {
                                        if (scores[0].locationsRegistrations[0].raceScore != 0) {
                                            scores.sort((a, b) => (a.locationsRegistrations[0].raceScore >= b.locationsRegistrations[0].raceScore) ? -1 : 1);
                                            for (let i = 0; i < scores.length; i++) {
                                                scores[i].placement = i + 1;
                                            }
                                        } else {
                                            scores.sort((a, b) => (a.shipId > b.shipId) ? 1 : -1);
                                        }
                                    }
                                    return res.status(200).json(scores);
                                }
                            });
                        });
                    } else
                        pending--;
                });
            });
            if (pending === 0)
                return res.status(200).send(scores);
        } else
            return res.status(200).send({});
    });
};
// Retrieve all locationRegistrations from an event
exports.getReplay = (req, res) => {
    eventRegistration_1.EventRegistrationModel.find({eventId: req.params.eventId}, {
        _id: 0,
        __v: 0
    }, (err, eventRegistrations) => {
        if (err) {
            return res.status(500).send({message: err.message || "Some error occurred while retriving eventRegistrations"});
        }
        if (eventRegistrations.length !== 0) {
            const shipLocations = [];
            eventRegistrations.forEach(eventRegistration => {
                pending++;
                locationRegistration_1.LocationRegistrationModel.find({eventRegId: eventRegistration.eventRegId}, {
                    _id: 0,
                    __v: 0
                }, {sort: {'locationTime': 1}}, function (err, locationRegistrations) {
                    pending--;
                    if (err)
                        return res.status(500).send({message: err.message || "Some error occurred while retriving registrations"});
                    if (locationRegistrations) {
                        const shipLocation = {
                            "locationsRegistrations": locationRegistrations,
                            "color": eventRegistration.trackColor,
                            "shipId": eventRegistration.shipId,
                            "teamName": eventRegistration.teamName
                        };
                        shipLocations.push(shipLocation);
                    }
                    if (pending === 0) {
                        return res.status(200).send(shipLocations);
                    }
                });
            });
        } else {
            return res.status(200).send({});
        }
    });
};
// Deleting all locationRegistration with an given eventRegId
exports.deleteFromEventRegId = (req, res) => {
    // Checking if authorized
    authentication_controller_1.Authorize(req, res, "user", function (err) {
        if (err)
            return err;
        // Finding and deleting the locationRegistrations with the given eventRegId
        locationRegistration_1.LocationRegistrationModel.deleteMany({eventRegId: req.params.eventId}, (err, locationRegistrations) => {
            if (err)
                return res.status(500).send({message: "Error deleting locationRegistrations with eventRegId " + req.params.regId});
            if (!locationRegistrations)
                return res.status(404).send({message: "LocationRegistrations not found with eventRegId " + req.params.regId});
            res.status(202).json();
        });
    });
};

function validateForeignKeys(registration, res, callback) {
    // Checking if eventReg exists
    eventRegistration_1.EventRegistrationModel.findOne({eventRegId: registration.eventRegId}, function (err, eventReg) {
        if (err)
            return callback(res.status(500).send({message: err.message || "Some error occurred while retriving event eventRegistration"}));
        if (!eventReg)
            return callback(res.status(404).send({message: "EventRegistration with id " + registration.eventRegId + " was not found"}));
        return callback();
    });
}

ex;
//# sourceMappingURL=locationRegistration.controller.js.map