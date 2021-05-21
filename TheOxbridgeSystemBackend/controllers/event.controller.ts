import {EnforceDocument} from "mongoose";

export {};
import {EventRegistrationModel} from "../models/eventRegistration";
import {EventModel} from "../models/event";
import {ShipModel} from "../models/ship";
import {Authorize} from "./authentication.controller"
import {RacePointModel} from "../models/racePoint";
import {ShipSchema} from "../models/ships"

// Create and Save a new Event
exports.create = (req, res) => {

    // Checking if authorized
    Authorize(req, res, "admin", err => {
        if (err)
            return err;


        const event = new EventModel(req.body);

        // Finding next eventId
        EventModel.findOne({}).sort('-eventId').exec((err, lastEvent) => {
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

    RacePointModel.find({eventId: req.params.eventId}, {_id: 0, __v: 0}, null, (err, racePoint) => {
        if (err)
            return res.status(500).send({message: "false"});
        if (racePoint && racePoint.length !== 0)
            return res.status(200).send(true);
        else
            return res.status(200).send(false);
    })
}

// Retrieve and return all events from the database.
exports.findAll = (req, res) => {
    EventModel.find({}, {_id: 0, __v: 0}, null,(err, events): any => {
        if (err)
            return res.status(500).send({message: err.message || "Some error occurred while retriving events"});

        res.status(200).json(events);
    });
};

// Get all events that the user is a participant of
let pending = 0;
exports.findFromUsername = (req, res) => {

    // Checking if authorized
    Authorize(req, res, "all", (err, decodedUser) => {
        if (err)
            return err;

        // Finding all the ships the user owns
        const events = [];
        ShipModel.find({emailUsername: decodedUser.id}, {_id: 0, __v: 0},null,  (err, ships) => {
            if (err)
                return res.status(500).send({message: err.message || "Some error occurred while retriving ships"});

            if (ships.length > 0) {
                // Finding all eventRegistrations with a ship that the user owns
                ships.forEach(ship => {
                    EventRegistrationModel.find({shipId: ship.shipId}, {
                        _id: 0,
                        __v: 0
                    },

                        null,(err, eventRegistrations) => {
                        if (err)
                            return res.status(500).send({message: err.message || "Some error occurred while retriving eventRegistrations"});

                        if (eventRegistrations) {
                            eventRegistrations.forEach(eventRegistration => {
                                pending++;
                                ShipModel.findOne({shipId: eventRegistration.shipId}, {
                                    _id: 0,
                                    __v: 0
                                }, null, (err,  ship: EnforceDocument<ShipSchema, {}>|null) => {
                                    if (err)
                                        return res.status(500).send({message: err.message || "Some error occurred while retriving the ship"});

                                    if (ship) {
                                        EventModel.findOne({eventId: eventRegistration.eventId}, {
                                            _id: 0,
                                            __v: 0
                                        },null, (err, event) => {
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
    EventModel.findOne({eventId: req.params.eventId}, {_id: 0, __v: 0}, null, (err, event) => {
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
    Authorize(req, res, "admin", err => {
        if (err)
            return err;

        const newEvent = req.body;
        newEvent.eventId = req.params.eventId;
        EventModel.updateOne({eventId: req.params.eventId}, newEvent, err, event => {
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
   Authorize(req, res, "admin", err => {
        if (err)
            return err;

        const updatedEvent = {isLive: true, actualEventStart: req.body.actualEventStart};
        EventModel.findOneAndUpdate({eventId: req.params.eventId}, updatedEvent, {new: true}, (err, event) => {
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
  Authorize(req, res, "admin", err => {
        if (err)
            return err;

        EventModel.findOneAndUpdate({eventId: req.params.eventId}, {isLive: false}, {new: true}, (err, event) => {
            if (err)
                return res.status(500).send({message: "Error updating event with eventId " + req.params.eventId});
            if (!event)
                return res.status(404).send({message: "Event not found with eventId " + req.params.eventId});
            else
                res.status(202).json(event);
        })
    })
}

// Delete an event with the specified eventId in the request
exports.delete = (req, res) => {

    // Checking if authorized
    Authorize(req, res, "admin", err => {
        if (err)
            return err;

        // Finding and the deleting the event with the given eventId
        EventModel.findOneAndDelete({eventId: req.params.eventId}, (err, event) => {
            if (err)
                return res.status(500).send({message: "Error deleting event with eventId " + req.params.eventId});
            if (!event)
                return res.status(404).send({message: "Event not found with eventId " + req.params.eventId});

            // Finding and deleting every EventRegistration with the given eventId
            EventRegistrationModel.deleteMany({eventId: req.params.eventId}, {
                id: 0,
                __v: 0
            }, (err, eventRegs) => {
                if (err)
                    return res.status(500).send({message: "Error deleting eventRegistration with eventId " + req.params.eventId});

                // Finding and deleting every RacePoint with the given eventId
                RacePointModel.deleteMany({eventId: req.params.eventId}, {_id: 0, __v: 0}, (err, racepoints) => {
                    if (err)
                        return res.status(500).send({message: "Error deleting RacePoints with eventId " + req.params.eventId});

                    res.status(202).json(event);
                })
            })
        });
    });
};