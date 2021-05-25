import {connect} from "mongoose";
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import dotenv from 'dotenv';
import {Event, IEvent} from "./src/models/event";
import {Auth} from './src/controllers/authentication.controller'
import {Eve, IEventRegistration} from './src/models/eventRegistration'
import {IRacePoint, RacePointModel} from './src/models/racePoint'
import {IShip, ShipModel} from './src/models/ship'

dotenv.config({path: 'config/config.env'});


const app = express();

app.use(cors());

const urlencode = bodyParser.urlencoded({extended: true});
app.use(express.static('public'));
app.use(bodyParser.json());

connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// ROUTING
const router = express.Router();

// TO PROCESS THE NEXT REQUEST !!
router.use(function (req, res, next) {
    console.log("recieved a request now, ready for the next");
    next();
});

app.use('/', router);
// FINDALL EVENTS
app.get('/events', async (req, res) => {
    try {
        const events: IEvent[] = await Event.find({}, {_id: 0, __v: 0});
        res.status(201).json(events);
    } catch (e) {
        res.status(400).send('BAD REQUEST')
    }
});
// POST EVENT
app.post('/events', async (req, res) => {
    try {
        const verify: Boolean = await Auth.Authorize(req, res, req.params.role);
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        const event = new Event(req.body);
        const one: any = 1;
        const lastEvent: IEvent = await Event.findOne({}).sort('desc');

        if (lastEvent) {
            event.eventId = lastEvent.eventId + one;
        } else {
            event.eventId = 1;
        }


        // Saving the new Event in the DB
        event.save();
        res.status(201).json(event);


    } catch (e) {
        res.status(400).send('BAD REQUEST')
    }
});
// FIND SINGLE EVENT
app.get('/events/:eventId', async (req, res) => {
    try {
        const evId: any = req.params.eventId;
        const event: IEvent = await Event.findOne({eventId: evId}, {_id: 0, __v: 0});

        if (!event) {
            res.status(400).send('Event not found');
        } else {
            res.status(200).send(event);
        }
    } catch (e) {
        res.status(400).send('BAD REQUEST');
    }
});

// UPDATE EVENT
app.put('/events/:eventId', async (req, res) => {
    try {
        const verify: Boolean = await Auth.Authorize(req, res, req.params.role);
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        const newEvent: any = req.body;
        const evId: any = req.params.eventId;
        newEvent.eventId = req.params.eventId;
        Event.updateOne({eventId: evId}, newEvent);
        res.status(202).json(newEvent);
    } catch (e) {
        res.status(400).send('BAD REQUEST');
    }


});

app.delete('/events/:eventId', async (req, res) => {
    try {
        // Checking if authorized
        const verify: Boolean = await Auth.Authorize(req, res, req.params.role);
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        const evId: any = req.params.eventId;
        // Finding and the deleting the event with the given eventId
        Event.findOneAndDelete({eventId: evId});
        // Finding and deleting every EventRegistration with the given eventId
        EventRegistration.deleteMany({eventId: evId});
        // Finding and deleting every RacePoint with the given eventId
        RacePoint.deleteMany({eventId: evId});
        res.status(202).send('Event deleted');


    } catch (e) {
        res.status(400).send('BAD REQUEST')
    }
});

// Updating event property "isLive" to true
app.put('/events/startEvent/:eventId', async (req, res) => {
    try {
        // Checking if authorized
        const verify: Boolean = await Auth.Authorize(req, res, req.params.role);
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        const evId: any = req.params.eventId;
        const updatedEvent = {isLive: true, actualEventStart: req.body.actualEventStart}
        Event.findOneAndUpdate({eventId: evId}, updatedEvent, {new: true});
        res.status(202).send('Event is now Live');


    } catch (e) {
        res.status(400).send('BAD REQUEST')
    }
});

app.get('/events/stopEvent/:eventId', async (req, res) => {
    try {
        // Checking if authorized
        const verify: Boolean = await Auth.Authorize(req, res, req.params.role);
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        const evId: any = req.params.eventId;
        Event.findOneAndUpdate({eventId: evId}, {isLive: false}, {new: true});
        res.status(202).send('Event Stopped');
    } catch (e) {
        res.status(400).send('BAD REQUEST')
    }
});

app.get('/events/hasRoute/:eventId', async (req, res) => {
    try {
        const evId: any = req.params.eventId;
        const racepoints: IRacePoint[] = await RacePoint.find({eventId: evId}, {_id: 0, __v: 0});
        if (racepoints && racepoints.length !== 0)
            return res.status(200).send(true);
        else
            return res.status(200).send(false);

    } catch (e) {
        res.status(400).send('BAD REQUEST')
    }
});

app.get('/events/myEvents/findFromUsername', async (req, res) => {
    try {
        // Checking if authorized
        const verify: Boolean = await Auth.Authorize(req, res, req.params.role);
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        // Finding all the ships the user owns
        const events: any[] = [];
        const ships: IShip[] = await ShipModel.find({emailUsername: req.params.emailUsername}, {_id: 0, __v: 0});

        if (ships.length > 0) {
            // Finding all eventRegistrations with a ship that the user owns
            ships.forEach(async (ship: IShip) => {
                const eventRegistrations: IEventRegistration[] = await EventRegistration.find({shipId: ship.shipId}, {
                    _id: 0,
                    __v: 0
                });
                if (eventRegistrations) {
                    eventRegistrations.forEach(async (eventRegistration: IEventRegistration) => {
                        pending++;
                        const ship: IShip = await ShipModel.findOne({shipId: eventRegistration.shipId}, {_id: 0, __v: 0});
                        if (ship) {
                            const event: IEvent = await Event.findOne({eventId: eventRegistration.eventId}, {
                                _id: 0,
                                __v: 0
                            });
                            pending--
                            if (event) {
                                events.push({
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
                            if (pending == 0) {
                                res.status(200).send(events);
                            }

                        }


                    });
                }
            });

        } else {
            res.status(200).send(events);
        }


    } catch (e) {
        res.status(400).send('BAD REQUEST')
    }
});

// Create a new ship
app.post('/ships', async (req, res) => {
    try {
        // Checking if authorized
        const verify: Boolean = await Auth.Authorize(req, res, "user");
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        const ship = new ShipModel(req.body);

        // Finding next shipId
        const one: any = 1;
        const lastShip: IShip = await ShipModel.findOne({}).sort('desc');
        if (lastShip)
            ship.shipId = lastShip.shipId + one;
        else
            ship.shipId = 1;

        // Saving the new ship in the DB
        await ship.save()

        res.status(201).json(ship);


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }

});

// Retrieve all ships
app.get('/ships', async (req, res) => {
    try {

        // Finding all ships in the db
        const ships: IShip[] = await ShipModel.find({}, {_id: 0, __v: 0});
        res.status(200).json(ships);

    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

// Retrieve a single ship
app.get('/ships/:shipId', async (req, res) => {
    try {
        const sId: any = req.params.shipId;
        const ship: IShip = await Ship.findOne({shipId: sId}, {_id: 0, __v: 0});
        if (!ship)
            return res.status(404).send({message: "Ship with id " + req.params.shipId + " was not found"});

        res.status(200).send({"name": ship.name, "shipId": ship.shipId});


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

// Retrieve all ships participating in the given event
app.get('/ships/fromEventId/:eventId', async (req, res) => {
    try {
        const evId: any = req.params.eventId;
        let pending: number;
        const eventRegistrations: IEventRegistration[] = await EventRegistration.find({eventId: evId}, {
            _id: 0,
            __v: 0
        });
        if (eventRegistrations.length != 0) {
            const ships: any[] = [];
            eventRegistrations.forEach(async (eventRegistration: IEventRegistration) => {
                pending++;
                const ship: IShip = await ShipModel.findOne({shipId: eventRegistration.shipId}, {_id: 0, __v: 0});
                if (ship) {
                    ships.push({"shipId": ship.shipId, "name": ship.name, "teamName": eventRegistration.teamName});
                }
                if (pending === 0) {
                    res.status(200).json(ships);
                }
            });
        } else {
            res.status(200).json({});
        }
    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

// Retrieve all user ships
app.get('/ships/myShips/fromUsername', async (req, res) => {
    try {
        const email: any = req.params.emailUsername;
        const ships: IShip[] = await ShipModel.find({emailUsername: email.id}, {_id: 0, __v: 0});
        res.status(200).send(ships);
    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

// Update a ship
app.put('/ships/:shipId', async (req, res) => {
    try {
        // Checking if authorized
        const verify: Boolean = await Auth.Authorize(req, res, "admin");
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        // Finding and updating the ship with the given shipId
        const newShip = new ShipModel(req.body);
        const sId: any = req.params.shipId;
        const ship: IShip = await ShipModel.findOneAndUpdate({shipId: sId}, newShip);
        if (!ship)
            return res.status(404).send({message: "Ship not found with shipId " + req.params.shipId});

        res.status(202).json(ship);
    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

// Delete a ship
app.delete('/ships/:shipId', async (req, res) => {
    try {
        // Checking if authorized

        // Finding and deleting the ship with the given shipId
        const sId: any = req.params.shipId;
        const ship: IShip = await ShipModel.findOneAndDelete({shipId: sId});
        if (!ship)
            return res.status(404).send({message: "Ship not found with shipId " + req.params.shipId});

        res.status(202).json(ship);

    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

// Retrieve start and finish racepoints from an specific event
app.get('/racePoints/findStartAndFinish/:eventId', async (req, res) => {
    try {
        const evId: any = req.params.eventId;
        const racePoints: IRacePoint[] = await RacePoint.find({
            eventId: evId,
            $or: [{type: 'startLine'}, {type: 'finishLine'}]
        }, {_id: 0, __v: 0});
        res.status(200).json(racePoints);

    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

// Retrieve all racepoints from an specific event
app.get('/racepoints/fromEventId/:eventId', async (req, res) => {
    const evId: any = req.params.eventId;
    const racePoints: IRacePoint[] = await RacePoint.find({eventId: evId}, {
        _id: 0,
        __v: 0
    }, {sort: {racePointNumber: 1}});
    return res.status(200).send(racePoints);
});

// Creates a new route of racepoints for an event
app.post('/racepoints/createRoute/:eventId', async (req, res) => {
    try {
        // Create new racepoints

        // Checking if authorized
        const verify: Boolean = await Auth.Authorize(req, res, "admin");
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        // Deleting all previous racePoints
        const evId: any = req.params.eventId;
        RacePoint.deleteMany({eventId: evId});

        const racePoints = req.body;
        if (Array.isArray(racePoints)) {
            const lastRacePoint: IRacePoint = await RacePoint.findOne({}).sort('desc');
            let racepointId: number;
            const lastRaceP: any = lastRacePoint.racePointId;
            if (lastRacePoint)
                racepointId = lastRaceP;
            else
                racepointId = 1;

            racePoints.forEach(racePoint => {
                const racepoint = new RacePoint(racePoint);
                racepointId = racepointId + 1;
                racepoint.racePointId = racepointId;

                // Saving the new racepoint in the DB
                racepoint.save();

                res.status(201).json(racePoints);
            });
        } else
            return res.status(400).send();


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});


export {app}