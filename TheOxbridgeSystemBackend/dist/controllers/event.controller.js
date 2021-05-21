"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const eventRegistration_1 = require("../models/eventRegistration");
const event_1 = require("../models/event");
const ship_1 = require("../models/ship");
const authentication_controller_1 = require("./authentication.controller");
const racePoint_1 = require("../models/racePoint");
// Create and Save a new Event
exports.create = (req, res) => {
    // Checking if authorized
    authentication_controller_1.Authorize(req, res, "admin", err => {
        if (err)
            return err;
        const event = new event_1.EventModel(req.body);
        // Finding next eventId
        event_1.EventModel.findOne({}).sort('-eventId').exec((err, lastEvent) => {
            if (err)
                return res.status(500).send({message: err.message || "Some error occurred while retriving events"});
            if (lastEvent)
                event.eventId = lastEvent.eventId + 1;
            else
                event.eventId = 1;
            // Saving the new Event in the DB
            event.save(err => {
                if (err)
                    return res.send(err);
                res.status(201).json(event);
            });
        });
    });
};
// Checking if event has a route
exports.hasRoute = (req, res) => {
    racePoint_1.RacePointModel.find({eventId: req.params.eventId}, {_id: 0, __v: 0}, null, (err, racePoint) => {
        if (err)
            return res.status(500).send({message: "false"});
        if (racePoint && racePoint.length !== 0)
            return res.status(200).send(true);
        else
            return res.status(200).send(false);
    });
};
// Retrieve and return all events from the database.
exports.findAll = (req, res) => {
    event_1.EventModel.find({}, {_id: 0, __v: 0}, null, (err, events) => {
        if (err)
            return res.status(500).send({message: err.message || "Some error occurred while retriving events"});
        res.status(200).json(events);
    });
};
// Get all events that the user is a participant of
let pending = 0;
exports.findFromUsername = (req, res) => {
    // Checking if authorized
    authentication_controller_1.Authorize(req, res, "all", (err, decodedUser) => {
        if (err)
            return err;
        // Finding all the ships the user owns
        const events = [];
        ship_1.ShipModel.find({emailUsername: decodedUser.id}, {_id: 0, __v: 0}, null, (err, ships) => {
            if (err)
                return res.status(500).send({message: err.message || "Some error occurred while retriving ships"});
            if (ships.length > 0) {
                // Finding all eventRegistrations with a ship that the user owns
                ships.forEach(ship => {
                    eventRegistration_1.EventRegistrationModel.find({shipId: ship.shipId}, {
                        _id: 0,
                        __v: 0
                    }, null, (err, eventRegistrations) => {
                        if (err)
                            return res.status(500).send({message: err.message || "Some error occurred while retriving eventRegistrations"});
                        if (eventRegistrations) {
                            eventRegistrations.forEach(eventRegistration => {
                                pending++;
                                ship_1.ShipModel.findOne({shipId: eventRegistration.shipId}, {
                                    _id: 0,
                                    __v: 0
                                }, null, (err, ship) => {
                                    if (err)
                                        return res.status(500).send({message: err.message || "Some error occurred while retriving the ship"});
                                    if (ship) {
                                        event_1.EventModel.findOne({eventId: eventRegistration.eventId}, {
                                            _id: 0,
                                            __v: 0
                                        }, null, (err, event) => {
                                            pending--;
                                            if (event) {
                                                event.push({
                                                    "eventId": event.eventId,
                                                    "name": event.name,
                                                    "eventStart": event.eventStart,
                                                    "eventEnd": event.eventEnd,
                                                    "city": event.city,
                                                    "eventRegId": eventRegistration.eventRegId,
                                                    "shipName": ship.name,
                                                    "teamName": eventRegistration.teamName,
                                                    "isLive": event.isLive,
                                                    "actualEventStart": event.actualEventStart
                                                });
                                            }
                                            if (pending === 0) {
                                                res.status(200).send(events);
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    });
                });
            } else {
                res.status(200).send(events);
            }
        });
    });
};
// Find a single event with the given eventId
exports.findOne = (req, res) => {
    event_1.EventModel.findOne({eventId: req.params.eventId}, {_id: 0, __v: 0}, null, (err, event) => {
        if (err)
            return res.status(500).send({message: "Error retrieving event with eventId " + req.params.eventId});
        if (!event)
            return res.status(404).send({message: "Event not found with eventId " + req.params.eventId});
        res.status(200).send(event);
    });
};
// Finding and updating event with the given eventId
exports.update = (req, res) => {
    // Checking if authorized
    authentication_controller_1.Authorize(req, res, "admin", err => {
        if (err)
            return err;
        const newEvent = req.body;
        newEvent.eventId = req.params.eventId;
        event_1.EventModel.updateOne({eventId: req.params.eventId}, newEvent, err, event => {
            if (err)
                return res.status(500).send({message: err.message || "Error updating bikeRackStation with stationId " + req.params.eventId});
            if (!event)
                return res.status(404).send({message: "BikeRackStation not found with stationId " + req.params.eventId});
            res.status(202).json(newEvent);
        });
    });
};
// Changes event property "isLive" to true
exports.StartEvent = (req, res) => {
    // Checking if authorized
    authentication_controller_1.Authorize(req, res, "admin", err => {
        if (err)
            return err;
        const updatedEvent = {isLive: true, actualEventStart: req.body.actualEventStart};
        event_1.EventModel.findOneAndUpdate({eventId: req.params.eventId}, updatedEvent, {new: true}, (err, event) => {
            if (err)
                return res.status(500).send({message: "Error updating event with eventId " + req.params.eventId});
            if (!event)
                return res.status(404).send({message: "Event not found with eventId " + req.params.eventId});
            res.status(202).json(event);
        });
    });
};
// Changes event property "isLive" to false
exports.StopEvent = (req, res) => {
    // Checking if authorized
    authentication_controller_1.Authorize(req, res, "admin", err => {
        if (err)
            return err;
        event_1.EventModel.findOneAndUpdate({eventId: req.params.eventId}, {isLive: false}, {new: true}, (err, event) => {
            if (err)
                return res.status(500).send({message: "Error updating event with eventId " + req.params.eventId});
            if (!event)
                return res.status(404).send({message: "Event not found with eventId " + req.params.eventId});
            else
                res.status(202).json(event);
        });
    });
};
// Delete an event with the specified eventId in the request
exports.delete = (req, res) => {
    // Checking if authorized
    authentication_controller_1.Authorize(req, res, "admin", err => {
        if (err)
            return err;
        // Finding and the deleting the event with the given eventId
        event_1.EventModel.findOneAndDelete({eventId: req.params.eventId}, (err, event) => {
            if (err)
                return res.status(500).send({message: "Error deleting event with eventId " + req.params.eventId});
            if (!event)
                return res.status(404).send({message: "Event not found with eventId " + req.params.eventId});
            // Finding and deleting every EventRegistration with the given eventId
            eventRegistration_1.EventRegistrationModel.deleteMany({eventId: req.params.eventId}, {
                id: 0,
                __v: 0
            }, (err, eventRegs) => {
                if (err)
                    return res.status(500).send({message: "Error deleting eventRegistration with eventId " + req.params.eventId});
                // Finding and deleting every RacePoint with the given eventId
                racePoint_1.RacePointModel.deleteMany({eventId: req.params.eventId}, {
                    _id: 0,
                    __v: 0
                }, (err, racepoints) => {
                    if (err)
                        return res.status(500).send({message: "Error deleting RacePoints with eventId " + req.params.eventId});
                    res.status(202).json(event);
                });
            });
        });
    });
};
//# sourceMappingURL=event.controller.js.map