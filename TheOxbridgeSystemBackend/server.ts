import {connect} from "mongoose";
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import dotenv from 'dotenv';
import {Event, IEvent} from "./src/models/event";
import {Auth} from './src/controllers/authentication.controller'
import {EventRegistration, IEventRegistration} from './src/models/eventRegistration'
import {IRacePoint, RacePointModel} from './src/models/racePoint'
import {IShip, ShipModel} from './src/models/ship'
import {AccessToken} from "./src/controllers/accessToken.controller";
import {IUser, UserModel} from "./src/models/user";
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {Validate} from "./src/controllers/validate.controller";
import {LocationRegistrationModel} from "./src/models/locationRegistration";

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
        await event.save();
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
        await Event.findOneAndDelete({eventId: evId});
        // Finding and deleting every EventRegistration with the given eventId
        await EventRegistration.deleteMany({eventId: evId});
        // Finding and deleting every RacePoint with the given eventId
        await RacePointModel.deleteMany({eventId: evId});
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
        await Event.findOneAndUpdate({eventId: evId}, updatedEvent, {new: true});
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
        const racepoints: IRacePoint[] = await RacePointModel.find({eventId: evId}, {_id: 0, __v: 0});
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
            let pending = 0;
            // Finding all eventRegistrations with a ship that the user owns
            ships.forEach(async (ship: IShip) => {
                const eventRegistrations: IEventRegistration[] = await EventRegistration.find({shipId: ship.shipId}, {
                    _id: 0,
                    __v: 0
                });
                if (eventRegistrations) {
                    eventRegistrations.forEach(async (eventRegistration: IEventRegistration) => {
                        pending++;
                        const ship: IShip = await ShipModel.findOne({shipId: eventRegistration.shipId}, {
                            _id: 0,
                            __v: 0
                        });

                        if (ship) {
                            const event: IEvent = await Event.findOne({eventId: eventRegistration.eventId}, {
                                _id: 0,
                                __v: 0
                            });
                            pending--
                            if (event) {
                                await events.push({
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
        const ship: IShip = await ShipModel.findOne({shipId: sId}, {_id: 0, __v: 0});
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
                    await ships.push({
                        "shipId": ship.shipId,
                        "name": ship.name,
                        "teamName": eventRegistration.teamName
                    });
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
        const racePoints: IRacePoint[] = await RacePointModel.find({
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
    const racePoints: IRacePoint[] = await RacePointModel.find({eventId: evId}, {
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
        await RacePointModel.deleteMany({eventId: evId});
        const racePoints = req.body;
        if (Array.isArray(racePoints)) {
            const lastRacePoint: IRacePoint = await RacePointModel.findOne({}).sort('desc');
            let racepointId: number;
            const lastRaceP: any = lastRacePoint.racePointId;
            if (lastRacePoint)
                racepointId = lastRaceP;
            else
                racepointId = 1;

            await racePoints.forEach(async (racePoint: IRacePoint) => {
                const racepoint = new RacePointModel(racePoint);
                racepointId = racepointId + 1;
                racepoint.racePointId = racepointId;
                // Saving the new racepoint in the DB
                await racepoint.save();
                res.status(201).json(racePoints);
            });
        } else
            return res.status(400).send();
    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

// Retrieve all Users
app.get('/users', async (req, res) => {
    try {
        // Checking if authorized
        const verify: Boolean = await Auth.Authorize(req, res, "admin");
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        // Finding all users
        const users: IUser[] = await UserModel.find({}, {_id: 0, __v: 0});
        res.status(200).json(users);


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

// Retrieve a single User with the given emailUsername
app.get('/users/:userName', async (req, res) => {
    try {
        // Finding the user with the given userId
        const user: IUser = await UserModel.findOne({emailUsername: req.params.emailUsername}, {_id: 0, __v: 0});
        if (!user)
            return res.status(404).send({message: "User not found with userName " + req.params.emailUsername});

        res.status(200).send(user);

    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

// Update a User with the given emailUsername
app.put('/users/:userName', async (req, res) => {
    try {
        // Updating the user
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const newUser = new UserModel(req.body);
        const token: any = req.header('x-access-token');
        const user: any = AccessToken.getUser(token);
        newUser.password = hashedPassword;
        newUser.role = user.role;

        UserModel.findOneAndUpdate({emailUsername: newUser.usernameMail}, newUser);
        if (!user)
            return res.status(404).send({message: "User not found with id " + req.params.emailUsername});

        res.status(202).json(user);

    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

// Delete a User with the given emailUsername
app.delete('/users/:userName', async (req, res) => {
    try {
        // Deleting the user with the given userId
        const user: IUser = await UserModel.findOneAndDelete({emailUsername: req.params.emailUsername});
        if (!user)
            return res.status(404).send({message: "User not found with id " + req.params.emailUsername});

        res.status(202).json(user);

    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

// Register a new admin
app.post('/users/registerAdmin', async (req, res) => {
    try {
        // Checking if authorized
        const verify: Boolean = await Auth.Authorize(req, res, "admin");
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        // Checking that no other user with that username exists
        const users: IUser[] = await UserModel.find({emailUsername: req.body.emailUsername});
        if (users)
            return res.status(409).send({message: "User with that username already exists"});

        // Creating the new user
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const user = new UserModel(req.body);
        user.password = hashedPassword;
        user.role = "admin";

        await user.save();

        const token = jwt.sign({id: user.usernameMail, role: "admin"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
        res.status(201).send({auth: true, token});


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

// Register a new user
app.post('/users/register', async (req, res) => {
    try {
        // Checking that no user with that username exists
        const isUser: IUser = await UserModel.findOne({emailUsername: req.body.emailUsername});
        if (isUser)
            return res.status(409).send({message: "User with that username already exists"});

        // Creating the user
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        const user = new UserModel(req.body);
        user.password = hashedPassword;
        user.role = "user";

        await user.save();

        // returning a token
        const token = jwt.sign({id: user.usernameMail, role: "user"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
        res.status(201).send({auth: true, token});

    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

// Login
app.post('/users/login', async (req, res) => {
    try {
        // Find the user and validate the password
        const user: IUser = await UserModel.findOne({emailUsername: req.body.emailUsername});
        if (!user) {
            return res.status(403).json('Username incorrect');
        }

        const userpw: any = user.password;
        const passwordIsValid = bcrypt.compareSync(req.body.password, userpw);

        if (!passwordIsValid) {
            return res.status(401).send({auth: false, token: null, message: "Invalid password"});
        }

        const token = jwt.sign({id: user.usernameMail, role: user.role}, process.env.TOKEN_SECRET, {expiresIn: 86400});
        res.status(200).send({
            emailUsername: user.usernameMail,
            firstname: user.firstname,
            lastname: user.lastname,
            auth: true,
            token
        });

    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});


app.post('/eventRegistrations/', async (req, res) => {
    try {
        // Checking if authorized
        const verify: Boolean = await Auth.Authorize(req, res, "admin");
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        // Finding next shipId
        const eventRegistration = new EventRegistration(req.body);
        const regDone: IEventRegistration = await Validate.createRegistration(eventRegistration, res);
        if (regDone == null) {
            return res.status(500).send({message: "SUCKS FOR YOU"});
        }
        res.status(201).json(regDone);


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }

});

// Retrieve all eventRegistrations
app.get('/eventRegistrations/', async (req, res) => {
    const verify: Boolean = await Auth.Authorize(req, res, "admin");
    if (!verify) {
        return res.status(400).send({auth: false, message: 'Not Authorized'});
    }

    try {
        const eventRegs: IEventRegistration[] = await EventRegistration.find({}, {_id: 0, __v: 0});
        res.status(200).send(eventRegs);
    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

// Retrieve all eventRegistrations where the given user is a participant
let pending: number = 0;
app.get('/eventRegistrations/findEventRegFromUsername/:eventId', async (req, res) => {
    // Checking if authorized
    const verify: Boolean = await Auth.Authorize(req, res, "admin");
    if (!verify) {
        return res.status(400).send({auth: false, message: 'Not Authorized'});
    }


    try {
        const token: any = req.header('x-access-token');
        const user: any = AccessToken.getUser(token);
        const eventRegistrations: any[] = [];
        const shipByEmailUserName: IShip[] = await ShipModel.find(user.emailUsername, {
            _id: 0,
            __v: 0
        });
        shipByEmailUserName.forEach(async (ship: IShip) => {
            pending++;
            const evId: any = req.params.eventId;
            const sId: any = ship.shipId;
            const eventRegistration: IEventRegistration[] = await EventRegistration.find({
                eventId: evId,
                shipId: sId
            }, {_id: 0, __v: 0})
            pending--;

            eventRegistrations.push(eventRegistration)
        });
        if (eventRegistrations)
            return res.status(200).send(eventRegistrations);


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

app.post('/eventRegistrations/signUp', async (req, res) => {
    // Checking if authorized
    const verify: Boolean = await Auth.Authorize(req, res, "admin");
    if (!verify) {
        return res.status(400).send({auth: false, message: 'Not Authorized'});
    }
    try {

        // Checks that the eventCode is correct
        const event: IEvent = await Event.findOne({eventCode: req.body.eventCode}, {_id: 0, __v: 0});
        if (!event)
            return res.status(404).send({message: "Wrong eventCode"});

        if (event) {
            // Checks that the ship isn't already assigned to the event
            const eventRegistration: IEventRegistration = await EventRegistration.findOne({
                shipId: req.body.shipId,
                eventId: event.eventId
            }, {_id: 0, __v: 0});

            if (eventRegistration)
                return res.status(409).send({message: "ship already registered to this event"})

            if (!eventRegistration) {

                // Creating the eventRegistration
                const registration = new EventRegistration(req.body);
                registration.eventId = event.eventId;
                const regDone: IEventRegistration = await Validate.createRegistration(registration, res);
                if (regDone == null) {
                    return res.status(500).send({message: "SUCKS FOR YOU"});
                }

                return res.status(201).json(regDone);

            }
        }


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

app.delete('/eventRegistrations/:eventRegId', async (req, res) => {
    // Checking if authorized
    const verify: Boolean = await Auth.Authorize(req, res, "all");
    if (!verify) {
        return res.status(400).send({auth: false, message: 'Not Authorized'});
    }
    try {
        const evRegId: any = req.params.eventRegId;
        // Finding and deleting the registration with the given regId
        const eventRegistration: IEventRegistration = await EventRegistration.findOneAndDelete({eventRegId: evRegId});
        if (!eventRegistration)
            return res.status(404).send({message: "EventRegistration not found with eventRegId " + req.params.eventRegId});
        res.status(202).json(eventRegistration);


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

app.post('/eventRegistrations/addParticipant', async (req, res) => {
    // Checking if authorized
    const verify: Boolean = await Auth.Authorize(req, res, "admin");
    if (!verify) {
        return res.status(400).send({auth: false, message: 'Not Authorized'});
    }
    try {
        // Creates a user if no user corresponding to the given emailUsername found
        const user: IUser = await UserModel.findOne({emailUsername: req.body.emailUsername}, {_id: 0, __v: 0});
        if (!user) {

            const hashedPassword = bcrypt.hashSync("1234", 10);
            const newUser = new UserModel({
                "emailUsername": req.body.emailUsername,
                "firstname": req.body.firstname,
                "lastname": req.body.lastname,
                "password": hashedPassword,
                "role": "user"
            });

            await newUser.save();
        }

        // Creating a ship if a ship with the given name and owned by the given user, doesn't exist
        const ship: IShip = await ShipModel.findOne({
            emailUsername: req.body.emailUsername,
            name: req.body.shipName
        }, {_id: 0, __v: 0});
        if (!ship) {

            const newShip = new ShipModel({"name": req.body.shipName, "emailUsername": req.body.emailUsername});

            const lastShip: IShip = await ShipModel.findOne({}).sort('-desc');
            const one: any = 1;
            if (lastShip)
                newShip.shipId = lastShip.shipId + one;
            else
                newShip.shipId = 1;

            await newShip.save();
            const newEventRegistration: IEventRegistration = new EventRegistration({
                "eventId": req.body.eventId,
                "shipId": newShip.shipId,
                "trackColor": "Yellow",
                "teamName": req.body.teamName
            });
            const regDone: IEventRegistration = await Validate.createRegistration(newEventRegistration, res);
            res.status(201).json(regDone);

        } else {
            const newEventRegistration = new EventRegistration({
                "eventId": req.body.eventId,
                "shipId": ship.shipId,
                "trackColor": "Yellow",
                "teamName": req.body.teamName
            })
            const regDone: IEventRegistration = await Validate.createRegistration(newEventRegistration, res);
            res.status(201).json(regDone);
        }


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

app.get('/eventRegistrations/getParticipants/:eventId', async (req, res) => {
    try {
        const participants: any[] = [];
        const evId: any = req.params.eventId;
        const eventRegs: IEventRegistration[] = await EventRegistration.find({eventId: evId}, {_id: 0, __v: 0});
        if (!eventRegs || eventRegs.length === 0)
            return res.status(404).send({message: "No participants found"});
        eventRegs.forEach(async (eventRegistration: IEventRegistration) => {
            pending++;
            const ship: IShip = await ShipModel.findOne({shipId: eventRegistration.shipId}, {_id: 0, __v: 0});
            if (!ship)
                return res.status(404).send({message: "Ship not found"});

            else if (ship) {
                const user: IUser = await UserModel.findOne({emailUsername: ship.emailUsername}, {_id: 0, __v: 0});
                pending--;
                if (!user)
                    return res.status(404).send({message: "User not found"});
                if (user) {
                    const participant: any = {
                        "firstname": user.firstname,
                        "lastname": user.lastname,
                        "shipName": ship.name,
                        "teamName": eventRegistration.teamName,
                        "emailUsername": user.usernameMail,
                        "eventRegId": eventRegistration.eventRegId
                    }
                    participants.push(participant);
                    if (pending === 0) {
                        return res.status(200).json(participants);
                    }
                }

            }
        })
    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

app.put('/eventRegistrations/updateParticipant/:eventRegId', async (req, res) => {
    // Checking if authorized
    const verify: Boolean = await Auth.Authorize(req, res, "admin");
    if (!verify) {
        return res.status(400).send({auth: false, message: 'Not Authorized'});
    }
    try {
        const evRegId: any = req.params.eventRegId;
        const eventReg: IEventRegistration = await EventRegistration.findOneAndUpdate({eventRegId: evRegId}, req.body);
        if (eventReg) {
            const ship: IShip = await ShipModel.findOneAndUpdate({shipId: eventReg.shipId}, req.body);
            if (ship) {
                const user: IUser = await UserModel.findOneAndUpdate({emailUsername: ship.emailUsername}, req.body);
                if (!user)
                    return res.status(404).send({message: "User not found with emailUsername " + ship.emailUsername});
                else
                    return res.status(200).send({updated: "true"})

            } else
                return res.status(404).send({message: "Ship not found with shipId " + eventReg.shipId});
        } else
            return res.status(404).send({message: "EventRegistration not found with eventRegId " + req.params.eventRegId});
    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

app.post('/locationRegistrations/', async (req, res) => {
    // Checking if authorized
    const verify: Boolean = await Auth.Authorize(req, res, "admin");
    if (!verify) {
        return res.status(400).send({auth: false, message: 'Not Authorized'});
    }
    try {


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

app.get('/locationRegistrations/getLive/:eventId', async (req, res) => {
    // Checking if authorized
    const verify: Boolean = await Auth.Authorize(req, res, "admin");
    if (!verify) {
        return res.status(400).send({auth: false, message: 'Not Authorized'});
    }
    try {


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

app.get('/locationRegistrations/getReplay/:eventId', async (req, res) => {
    // Checking if authorized
    const verify: Boolean = await Auth.Authorize(req, res, "admin");
    if (!verify) {
        return res.status(400).send({auth: false, message: 'Not Authorized'});
    }
    try {


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});


app.get('/locationRegistrations/getScoreboard/:eventId', async (req, res) => {
    // Checking if authorized
    const verify: Boolean = await Auth.Authorize(req, res, "admin");
    if (!verify) {
        return res.status(400).send({auth: false, message: 'Not Authorized'});
    }
    try {
        // Creating the LocationRegistration
        const locationRegistration = new LocationRegistrationModel(req.body);
        module.exports.createLocationRegistration(locationRegistration, res);

            return res.status(201).json(locationReg);


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

app.delete('/locationRegistrations/deleteFromEventRegId/:eventId', async (req, res) => {
    // Checking if authorized
    const verify: Boolean = await Auth.Authorize(req, res, "admin");
    if (!verify) {
        return res.status(400).send({auth: false, message: 'Not Authorized'});
    }
    try {


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

app.get('*', (req, res) => {
    return res.status(400).send('Page Not Found');
});

export {app}