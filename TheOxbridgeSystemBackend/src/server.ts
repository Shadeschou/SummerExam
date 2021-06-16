import {connect} from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import {EventModel, IEvent} from "./models/event";
import {Auth} from './controllers/authentication.controller';
import {EventRegistrationModel, IEventRegistration} from './models/eventRegistration';
import {IRacePoint, RacePointModel} from './models/racePoint';
import {AccessToken} from './controllers/accessToken.controller';
import {IShip, ShipModel} from './models/ship';
import {IUser, UserModel} from "./models/user";
import * as jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";
import {Validate} from "./controllers/validate.controller";
import {ILocationRegistration, LocationRegistrationModel} from "./models/locationRegistration";
import bcrypt from "bcrypt-nodejs";
import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import * as crypto from "crypto";
import {timerForTheReminder} from "./controllers/checkEvents";
import {Broadcast, IBroadcast} from "./models/broadcast";

timerForTheReminder();

dotenv.config({path: 'configs/config.env'});
const app = express();
app.use(cookieParser(process.env.TOKEN_SECRET));
app.use(cors());
const router = express.Router();

const urlencode = bodyParser.urlencoded({extended: true});
app.use(express.static('public'));
app.use(bodyParser.json());

connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

// ROUTING
// TO PROCESS THE NEXT REQUEST !!
router.use((req, res, next) => {
    next();
});

app.use('/', router);
/**
 *Find all events
 * @param json 201 - events
 */
app.get('/events', async (req, res) => {
    try {
        const events: IEvent[] = await EventModel.find({}, {_id: 0, __v: 0});
        res.status(201).json(events);
    } catch (e) {
        res.status(400).send('BAD REQUEST')
    }
});


/**
 * Post the event with auto increment.
 * @param 201 - with the event in json
 */
app.post('/events', async (req: express.Request, res: express.Response) => {
    try {
        const verify: boolean = await Auth.Authorize(req, res, "admin");
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        const event = new EventModel(req.body);
        const one: any = 1;
        const lastEvent: IEvent = await EventModel.findOne({}, {},{ sort: { eventId: -1 } }).sort('desc');

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
/**
 * find a single event
 * @param
 */
app.get('/events/:eventId', async (req, res) => {
    try {
        const evId: any = req.params.eventId;
        const event: IEvent = await EventModel.findOne({eventId: evId}, {_id: 0, __v: 0});

        if (!event) {
            res.status(400).send('Event not found');
        } else {
            res.status(200).send(event);
        }
    } catch (e) {
        res.status(400).send('BAD REQUEST');
    }
});

/**
 * Update the event
 * @param 202 - newEvent as Json
 */
app.put('/events/:eventId', async (req, res) => {
    try {
        const verify: boolean = await Auth.Authorize(req, res, "admin");
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        const newEvent: any = req.body;
        const evId: any = req.params.eventId;
        newEvent.eventId = req.params.eventId;
        EventModel.updateOne({eventId: evId}, newEvent);
        res.status(202).json(newEvent);
    } catch (e) {
        res.status(400).send('BAD REQUEST');
    }


});

/**
 * Deletes the event
 * No return
 */
app.delete('/events/:eventId', async (req, res) => {
    try {
        // Checking if authorized
        const verify: boolean = await Auth.Authorize(req, res, "admin");
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        const evId: any = req.params.eventId;
        // Finding and the deleting the event with the given eventId
        EventModel.findOneAndDelete({eventId: evId});
        // Finding and deleting every EventRegistration with the given eventId
        EventRegistrationModel.deleteMany({eventId: evId});
        // Finding and deleting every RacePoint with the given eventId
        RacePointModel.deleteMany({eventId: evId});
        res.status(202).send('Event deleted');


    } catch (e) {
        res.status(400).send('BAD REQUEST')
    }
});
/**
 *Updating event property "isLive" to true
 * @param
 */
app.put('/events/startEvent/:eventId', async (req, res) => {
    try {
        // Checking if authorized
        const verify: boolean = await Auth.Authorize(req, res, "admin");
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        const evId: any = req.params.eventId;
        const updatedEvent = {isLive: true, actualEventStart: req.body.actualEventStart}
        EventModel.findOneAndUpdate({eventId: evId}, updatedEvent, {new: true});
        res.status(202).send('Event is now Live');


    } catch (e) {
        res.status(400).send('BAD REQUEST')
    }
});
/**
 *Stopping an event.
 * @param
 */
app.get('/events/stopEvent/:eventId', async (req, res) => {
    try {
        // Checking if authorized
        const verify: boolean = await Auth.Authorize(req, res, "admin");
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        const evId: any = req.params.eventId;
        EventModel.findOneAndUpdate({eventId: evId}, {isLive: false}, {new: true});
        res.status(202).send('Event Stopped');
    } catch (e) {
        res.status(400).send('BAD REQUEST')
    }
});
/**
 * Checking for the events route.
 * @param
 */
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

/**
 * Finding the route from the given username.
 * @param events as json status 200
 */
app.get('/events/myEvents/findFromUsername', async (req, res) => {
    try {
        // Checking if authorized
        const verify: boolean = await Auth.Authorize(req, res, "admin");
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        // Finding all the ships the user owns
        const events: any[] = [];
        const token: any = req.header('x-access-token');
        const user: any = AccessToken.getUser(token);
        const ships: IShip[] = await ShipModel.find({emailUsername: user.emailUsername}, {_id: 0, __v: 0});


        if (ships.length > 0) {
            // Finding all eventRegistrations with a ship that the user owns
            ships.forEach(async (ship: IShip) => {
                const eventRegistrations: IEventRegistration[] = await EventRegistrationModel.find({shipId: ship.shipId}, {
                    _id: 0,
                    __v: 0
                });
                if (eventRegistrations) {
                    eventRegistrations.forEach(async (eventRegistration: IEventRegistration) => {

                        ship = await ShipModel.findOne({shipId: eventRegistration.shipId}, {_id: 0, __v: 0}, );
                        if (ship) {
                            const event: IEvent = await EventModel.findOne({eventId: eventRegistration.eventId}, {
                                _id: 0,
                                __v: 0
                            });

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

                        }
                    });
                }
            });
        }
        res.status(200).send(events);

    } catch (e) {
        res.status(400).send('BAD REQUEST')
    }
});

/**
 * Create a new ship
 * @param
 */
app.post('/ships', async (req, res) => {
    try {
        // Checking if authorized
        const verify: boolean = await Auth.Authorize(req, res, "user");
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        const ship = new ShipModel(req.body);

        // Finding next shipId
        const one: any = 1;
        const lastShip: IShip = await ShipModel.findOne({}, {_id: 0, __v: 0}, { sort: { shipId: -1 } });
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

/**
 * Retrieve all the ships
 * @param
 */
app.get('/ships', async (req, res) => {
    try {

        // Finding all ships in the db
        const ships: IShip[] = await ShipModel.find({}, {_id: 0, __v: 0});
        res.status(200).json(ships);

    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

/**
 * Retrieve a single ship
 * @param
 */
app.get('/ships/:shipId', async (req, res) => {
    try {
        const sId: any = req.params.shipId;
        const ship: IShip = await ShipModel.findOne({shipId: sId}, {_id: 0, __v: 0});
        if (!ship)
            return res.status(404).send({message: "Ship with id " + req.params.shipId + " was not found"});

        res.status(200).send({"name": ship.name, "shipId": ship.shipId, "emailUsername": ship.emailUsername});


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

/**
 *Retrieve all ships participating in the given event
 * @param
 */
app.get('/ships/fromEventId/:eventId', async (req, res) => {
    try {
        const evId: any = req.params.eventId;
        const ships: any[] = [];
        const eventRegistrations: IEventRegistration[] = await EventRegistrationModel.find({eventId: evId}, {
            _id: 0,
            __v: 0
        });
        if (eventRegistrations.length !== 0) {

            eventRegistrations.forEach(async (eventRegistration: IEventRegistration) => {

                const ship: IShip = await ShipModel.findOne({shipId: eventRegistration.shipId}, {_id: 0, __v: 0});
                if (ship) {
                    ships.push({"shipId": ship.shipId, "name": ship.name, "teamName": eventRegistration.teamName});
                }

            });
        }

        res.status(200).json(ships);

    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});
/**
 * Retrieve all user ships
 * @param
 */
app.get('/ships/myShips/fromUsername', async (req, res) => {
    try {
        const token: any = req.header('x-access-token');
        const user: any = AccessToken.getUser(token);
        const ships: IShip[] = await ShipModel.find({emailUsername: user.id}, {_id: 0, __v: 0});
        res.status(200).send(ships);
    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});
/**
 * Update a Ship
 * @param
 */
app.put('/ships/:shipId', async (req, res) => {
    try {
        // Checking if authorized
        const verify: boolean = await Auth.Authorize(req, res, "admin");
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

/**
 * Delete a Ship
 * @param
 */
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

/**
 * Retrieve start and finish racepoints from an specific event
 * @param
 */
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
/**
 *Retrieve all racepoints from an specific event
 * @param
 */
app.get('/racepoints/fromEventId/:eventId', async (req, res) => {
    const evId: any = req.params.eventId;
    const racePoints: IRacePoint[] = await RacePointModel.find({eventId: evId}, {
        _id: 0,
        __v: 0
    }, {sort: {racePointNumber: 1}});
    return res.status(200).send(racePoints);
});
/**
 * Creates a new route of racepoints for an event
 * @param
 */
app.post('/racepoints/createRoute/:eventId', async (req, res) => {
    try {
        // Create new racepoints

        // Checking if authorized
        const verify: boolean = await Auth.Authorize(req, res, "admin");
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        // Deleting all previous racePoints
        const evId: any = req.params.eventId;
        RacePointModel.deleteMany({eventId: evId});

        const racePoints = req.body;
        if (Array.isArray(racePoints)) {
            const lastRacePoint: IRacePoint = await RacePointModel.findOne({}, {}, {sort: {racePointId: -1}});
            let racepointId: number;
            const lastRaceP: any = lastRacePoint.racePointId;
            if (lastRacePoint)
                racepointId = lastRaceP;
            else
                racepointId = 1;

            racePoints.forEach(async (racePoint: IRacePoint) => {
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
/**
 *Retrieve all Users
 * @param
 */
app.get('/users', async (req, res) => {
    try {

        // Checking if authorized
        const verify: boolean = await Auth.Authorize(req, res, "admin");
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

/**
 *Retrieve a single User with the given emailUsername
 * @param
 */
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
/**
 *Update a User with the given emailUsername
 * @param
 */
app.put('/users/:userName', async (req, res) => {
    try {
        // Updating the user

        const hashedPassword = await bcrypt.hashSync(req.body.password);
        const userLoginIn: any = req.params.userName;


        const user: IUser = await UserModel.findOne({emailUsername: userLoginIn});

        // user.password = hashedPassword;
        user.role = user.role;
        // What Allie Did
        UserModel.findOne({emailUsername: user.emailUsername});
        if (!user)
            return res.status(404).send({message: "User not found with id " + req.params});
        else{
            await UserModel.findOneAndUpdate({ emailUsername: req.params.userName }, { password: hashedPassword, firstname: req.body.firstname, lastname: req.body.lastname, emailUsername: req.body.emailUsername });
        }
    } catch (e) {
        res.status(400).json('Update User failed.')
    }
});
/**
 *Delete a User with the given emailUsername
 * @param
 */
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
/**
 * Register a new admin
 * @param
 */
app.post('/users/registerAdmin', async (req, res) => {
    try {
        // Checking if authorized
        const verify: boolean = await Auth.Authorize(req, res, "admin");
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        // Checking that no other user with that username exists
        const users: IUser[] = await UserModel.find({emailUsername: req.body.emailUsername});
        if (users)
            return res.status(409).send({message: "User with that username already exists"});

        // Creating the new user
        const hashedPassword = await bcrypt.hashSync(req.body.password);
        const user = new UserModel(req.body);
        user.password = hashedPassword;
        user.role = "admin";

        await user.save();

        const token = jwt.sign({id: user.emailUsername, role: "admin"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
        res.status(201).send({auth: true, token});


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});
/**
 * Register a new user
 * @param status(201).send({auth: true, token}
 */
app.post('/users/register', async (req, res) => {

    try {
        // Checking that no user with that username exists
        const isUser: IUser = await UserModel.findOne({emailUsername: req.body.emailUsername});
        if (isUser){
            return res.status(409).send({ message: "User with that username already exists" });
        }
        // Creating the user
        const hashedPassword = await bcrypt.hashSync(req.body.password);
        const user = new UserModel(req.body);
        user.password = hashedPassword;
        user.role = "admin";

        await user.save();

        // returning a token
        const token = jwt.sign({id: user.emailUsername, role: "admin"}, process.env.TOKEN_SECRET, {expiresIn: 86400});
        res.status(201).send({auth: true, token});

        // Transporter object using SMTP transport
    } catch (e) {
        res.status(400).json('Failed to Register user')
    }
});
/**
 * Login
 * @param  res.status(202).json(user);
 */
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

        const token = jwt.sign({id: user.emailUsername, role: user.role}, process.env.TOKEN_SECRET, {expiresIn: 86400});
        res.status(200).send({
            emailUsername: user.emailUsername,
            firstname: user.firstname,
            lastname: user.lastname,
            auth: true,
            token
        });

    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

/**
 * Helper for the fogotten password. User found through the given email.
 * @param     res.status(202).json(user); && the email sent
 */
app.post('/users/forgot/:emailUsername', async (req, res) => {
    try {
        const tempToken: Buffer = crypto.randomBytes(5);
        const newPW = tempToken.toString('hex');
        // Updating the user
        const hashedPassword = await bcrypt.hashSync(newPW);
        const userLoginIn: any = req.params.emailUsername;

        const user: IUser = await UserModel.findOne({emailUsername: userLoginIn});
        UserModel.findOne({emailUsername: user.emailUsername});
        if (!user)
            return res.status(404).send({message: "User not found with id " + req.params});
        else{
            await UserModel.findOneAndUpdate({ emailUsername: req.params.emailUsername }, { password: hashedPassword });
        }
        const transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PSW,
            },
            tls:{
                "rejectUnauthorized": false
            },
    });
        // sending mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Treggata" <aljo0025@easv365.dk>',
            to: user.emailUsername,
            subject: "We got a little Something",
            text: "I know I know As we are all just humans \n" +
                "- The event takes place once a year. And you pour soul forgot to save the password.\n" +
                "Worse case. We though intended a better user experience. Take this password \n " +newPW + "\n " +
                "1st u wanna Login in with that password. \n 2nd you wanna go to profile (upper right corner) \n finally change the password to a new! :) \n" +
                "Welcome on Board! - Pun intended."
    });

        res.status(202).json(user);
    } catch (e) {
        res.status(400).json('Sent random pw failed.')
    }
});

/**
 * Creating the eventReg in the backend.
 * @param
 */
app.post('/eventRegistrations/', async (req, res) => {
    try {
        // Checking if authorized
        const verify: boolean = await Auth.Authorize(req, res, "admin");
        if (!verify) {
            return res.status(400).send({auth: false, message: 'Not Authorized'});
        }
        // Finding next shipId
        const eventRegistration = new EventRegistrationModel(req.body);
        const regDone: IEventRegistration = await Validate.createRegistration(eventRegistration, res);
        if (regDone === null) {
            return res.status(500).send({message: "eventRegistration failed."});
        }
        res.status(201).json(regDone);
    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

/**
 * Retrieving all the eventReg from the backend.
 * @param
 */

app.get('/eventRegistrations/', async (req, res) => {
    const verify: boolean = await Auth.Authorize(req, res, "admin");
    if (!verify) {
        return res.status(400).send({auth: false, message: 'Not Authorized'});
    }

    try {
        const eventRegs: IEventRegistration[] = await EventRegistrationModel.find({}, {_id: 0, __v: 0});
        res.status(200).send(eventRegs);
    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

/**
 *Retrieve all eventRegistrations where the given user is a participant
 * @param
 */
let pending: number = 0;
app.get('/eventRegistrations/findEventRegFromUsername/:eventId', async (req, res) => {
    // Checking if authorized
    const verify: boolean = await Auth.Authorize(req, res, "admin");
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
            const eventRegistration: IEventRegistration[] = await EventRegistrationModel.find({
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
/**
 * Signup to an event - And get confirmed via email
 * @param  res.status(201).json(regDone); Where RegDone is IEventRegistration
 */
app.post('/eventRegistrations/signUp', async (req, res) => {
    try {
               const event: IEvent = await EventModel.findOne({eventCode: req.body.eventCode}, {_id: 0, __v: 0});
        if (!event)
            return res.status(404).send({message: "Wrong eventCode"});
        if (event) {
            // Checks that the ship isn't already assigned to the event
            const eventRegistration: IEventRegistration = await EventRegistrationModel.findOne({
                shipId: req.body.shipId,
                eventId: event.eventId
            }, {_id: 0, __v: 0});

            if (eventRegistration)
                return res.status(409).send({message: "ship already registered to this event"})
            if (!eventRegistration) {

                // Creating the eventRegistration
                const registration = new EventRegistrationModel(req.body);
                registration.eventId = event.eventId;
                const regDone: IEventRegistration = await Validate.createRegistration(registration, res);
                if (regDone === null) {
                    return res.status(500).send({message: "creation failed"});
                }
                const foundShip: IShip = await ShipModel.findOne({shipId: req.body.shipId});
                // Transporter object using SMTP transport
                const transporter = nodemailer.createTransport({
                    host: "smtp.office365.com",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PSW,
                    },
                });
                // sending mail with defined transport object
                const info = await transporter.sendMail({
                    from: '"Treggata" <aljo0025@easv365.dk>', // sender address
                    to: foundShip.emailUsername, //
                    subject: "Event Participation Confirmation", // subject line
                    text: "Your team - " + req.body.teamName + ", is now listed in the event " + event.name + ", with the boat " + foundShip.name +".\n"
                    +"We are happy to have you onBoard - Pun intended, enjoy the ride and the best of Luck \n"
                    +" (ง︡'-'︠)ง May the Force be with you (ง︡'-'︠)ง",
                });

                return res.status(201).json(regDone);

            }
        }
    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});
/**
 * Deleting the evenReg by the given eventRegId
 * @param res.status(202).json({message: 'Registration Deleted'});
 */
app.delete('/eventRegistrations/:eventRegId', async (req, res) => {
    // Checking if authorized
    const verify: boolean = await Auth.Authorize(req, res, "all");
    if (!verify) {
        return res.status(400).send({auth: false, message: 'Not Authorized'});
    }
    try {
        const evRegId: any = req.params.eventRegId;
        // Finding and deleting the registration with the given regId
        const eventRegistration: IEventRegistration = await EventRegistrationModel.findOneAndDelete({eventRegId: evRegId});
        if (!eventRegistration)
            return res.status(404).send({message: "EventRegistration not found with eventRegId " + req.params.eventRegId});
        res.status(202).json({message: 'Registration Deleted'});
    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});
/**
 * Posting another participant to the db - Validating if the mail exists or not.
 * @param
 */
app.post('/eventRegistrations/addParticipant', async (req, res) => {
    // Checking if authorized
    const verify: boolean = await Auth.Authorize(req, res, "admin");
    if (!verify) {
        return res.status(400).send({auth: false, message: 'Not Authorized'});
    }
    try {
        const user: IUser = await UserModel.findOne({emailUsername: req.body.emailUsername}, {_id: 0, __v: 0});
        if (!user) {
            const hashedPassword = await bcrypt.hashSync("1234");
            const newUser = new UserModel({
                "emailUsername": req.body.emailUsername,
                "firstname": req.body.firstname,
                "lastname": req.body.lastname,
                "password": hashedPassword,
                "role": "user"
            });

            await newUser.save();
        }
        /**
         *Creating a ship if a ship with the given name and owned by the given user, doesn't exist
         */
        const ship: IShip = await ShipModel.findOne({
            emailUsername: req.body.emailUsername,
            name: req.body.shipName
        }, {_id: 0, __v: 0});
        if (!ship) {

            const newShip = new ShipModel({"name": req.body.shipName, "emailUsername": req.body.emailUsername});

            const lastShip: IShip = await ShipModel.findOne({}, {}, {sort: {shipId: -1}});
            const one: any = 1;
            if (lastShip)
                newShip.shipId = lastShip.shipId + one;
            else
                newShip.shipId = 1;

            await newShip.save();
            const newEventRegistration: IEventRegistration = new EventRegistrationModel({
                "eventId": req.body.eventId,
                "shipId": newShip.shipId,
                "trackColor": "Blue",
                "teamName": req.body.teamName
            });
            const regDone: IEventRegistration = await Validate.createRegistration(newEventRegistration, res);
            res.status(201).json(regDone);

        } else {
            const newEventRegistration = new EventRegistrationModel({
                "eventId": req.body.eventId,
                "shipId": ship.shipId,
                "trackColor": "Blue",
                "teamName": req.body.teamName
            })
            const regDone: IEventRegistration = await Validate.createRegistration(newEventRegistration, res);

            res.status(201).json(regDone);
        }


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});
/**
 *Get the participants connected to an eventregistration.
 * @param
 */
app.get('/eventRegistrations/getParticipants/:eventId', async (req, res) => {


    try {

        const participants: any[] = [];
        const evId: any = req.params.eventId;
        const eventRegs: IEventRegistration[] = await EventRegistrationModel.find({eventId: evId}, {_id: 0, __v: 0});
        if (!eventRegs || eventRegs.length === 0)
            return res.status(404).send({message: "No participants found"});


        eventRegs.forEach(async (eventRegistration: IEventRegistration) => {


            const ship: IShip = await ShipModel.findOne({shipId: eventRegistration.shipId}, {_id: 0, __v: 0});
            if (!ship)
                return res.status(404).send({message: "Ship not found"});

            else if (ship) {
                const user: IUser = await UserModel.findOne({emailUsername: ship.emailUsername}, {_id: 0, __v: 0});

                if (!user)
                    return res.status(404).send({message: "User not found"});

                if (user) {
                    const participant: any = {
                        "firstname": user.firstname,
                        "lastname": user.lastname,
                        "shipName": ship.name,
                        "teamName": eventRegistration.teamName,
                        "emailUsername": user.emailUsername,
                        "eventRegId": eventRegistration.eventRegId
                    }
                    participants.push(participant);

                    return res.status(200).json(participants);
                }
            }
        })
    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});
/**
 * NEW FEATURE: Post broadcast messages
 * posts the broadcast with the User of the ship connected to the eventregistration
 * @param    res.status(201).send()
 */

app.post('/broadcast', async (req, res) => {
    try {
        // Finds the event with the corresponding eventID
        const evId: any = req.body.eventId;
        const eventRegs: IEventRegistration[] = await EventRegistrationModel.find({ eventId: evId }, { _id: 0, __v: 0 });
        // Checks if there are participants
        if (!eventRegs || eventRegs.length === 0)
            return res.status(404).send({ message: "No participants found" });

        if (eventRegs.length !== 0) {
            // Goes through each participant
            eventRegs.forEach(async (eventRegistration: IEventRegistration) => {

                // Checks if the participant's ship exists
                const ship: IShip = await ShipModel.findOne({ shipId: eventRegistration.shipId }, { _id: 0, __v: 0 });
                if (!ship)
                    return res.status(404).send({ message: "Ship not found" });
                else if (ship) {
                    // checks if the ship's user exists
                    const user: IUser = await UserModel.findOne({ emailUsername: ship.emailUsername }, { _id: 0, __v: 0 });
                    if (!user)
                        return res.status(404).send({ message: "User not found" });
                    if (user) {
                        const participant = new Broadcast({
                            "eventId": req.body.eventId,
                            "message": req.body.message,
                            "emailUsername": user.emailUsername
                        });
                        await participant.save();
                    }

                }

            });
        }

        res.status(201).send({ message: 'Broadcast successfully sent' });

    } catch (e) {
        res.status(400).json('BAD REQUEST');
    }
});
/**
 * The the broadcast out of the DB after notifiing the participants the entry is deleted.
 * @param
 */
app.post('/getterForBroadcast', async (req, res) => {
    try {
        // getting the broadcasts from the db. Using the email to connect to the user.
        const username: any = req.body.Username;
        const broadcast: IBroadcast[] = await Broadcast.find({emailUsername: username}, {_id: 0,__v:0});
        await Broadcast.deleteMany({emailUsername: username});
        res.status(200).json({message: 'Found the Broadcast - Deleting by email.'});
    }
catch(e){
        res.status(400).json({message: "BAD REQUEST"});
}
    });


/**
 * Updating the participant. - If authorized.
 * @param
 */
app.put('/eventRegistrations/updateParticipant/:eventRegId', async (req, res) => {
    // Checking if authorized
    const verify: boolean = await Auth.Authorize(req, res, "admin");
    if (!verify) {
        return res.status(400).send({auth: false, message: 'Not Authorized'});
    }
    try {
        const evRegId: any = req.params.eventRegId;
        const eventReg: IEventRegistration = await EventRegistrationModel.findOneAndUpdate({eventRegId: evRegId}, req.body);
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

/**
 * Creating a new locationRegistration
 * @param
 */
app.post('/locationRegistrations/', async (req, res) => {
    // Checking if authorized

    try {
        // Creating the LocationRegistration
        let locationRegistration: ILocationRegistration = req.body;
        const val: boolean = await Validate.validateLocationForeignKeys(locationRegistration, res);
        if (!val) {
            return res.status(400).send({message: 'Could not create'});
        }
        // Finding next regId
        locationRegistration.locationTime.setHours(locationRegistration.locationTime.getHours() + 2);
        const locationReg: ILocationRegistration = await Validate.CheckRacePoint(locationRegistration, res);
        if (locationReg) {
            locationRegistration = locationReg;
        }
        const one: any = 1;
        const lastRegistration: ILocationRegistration = await LocationRegistrationModel.findOne({}).sort('-desc');
        if (lastRegistration)
            locationRegistration.regId = lastRegistration.regId + one;
        else
            locationRegistration.regId = 1;
        await locationRegistration.save();
        return res.status(201).json(locationRegistration);
    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});
/**
 * Getter for the events which are live at the moment
 * @param :eventId
 */
app.get('/locationRegistrations/getLive/:eventId', async (req, res) => {

    try {
        const evId: any = req.params.eventId;
        const eventRegistrations: IEventRegistration[] = await EventRegistrationModel.find({eventId: evId}, {
            _id: 0,
            __v: 0
        });


        const fewRegistrations: any[] = [];
        eventRegistrations.forEach(async (eventRegistration: IEventRegistration) => {


            const locationRegistration: ILocationRegistration[] = await LocationRegistrationModel.find({eventRegId: eventRegistration.eventRegId}, {
                _id: 0,
                __v: 0
            }, {sort: {'locationTime': -1}, limit: 20});

            if (locationRegistration.length !== 0) {
                const boatLocations: any = {
                    "locationsRegistrations": locationRegistration,
                    "color": eventRegistration.trackColor,
                    "shipId": eventRegistration.shipId,
                    "teamName": eventRegistration.teamName
                };
                fewRegistrations.push(boatLocations);

            }
        });
        if (fewRegistrations.length !== 0) {
            if (fewRegistrations[0].locationsRegistrations[0].raceScore !== 0) {
                fewRegistrations.sort((a, b) => (a.locationsRegistrations[0].raceScore >= b.locationsRegistrations[0].raceScore) ? -1 : 1)

                for (let i: any = 0; i < fewRegistrations.length; i++) {
                    fewRegistrations[i].placement = i + 1;
                }
            } else {
                fewRegistrations.sort((a, b) => (a.shipId > b.shipId) ? 1 : -1)

            }
        }
        return res.status(200).json(fewRegistrations);


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});
/**
 * Getting the reply from a race after putting all the shiplocations into place.
 * @param
 */
app.get('/locationRegistrations/getReplay/:eventId', async (req, res) => {

    try {

        const evId: any = req.params.eventId;
        const eventRegistrations: IEventRegistration[] = await EventRegistrationModel.find({eventId: evId}, {
            _id: 0,
            __v: 0
        });

        if (eventRegistrations.length !== 0) {
            const shipLocations: any[] = [];
            eventRegistrations.forEach(async (eventRegistration: IEventRegistration) => {

                const locationRegistrations: ILocationRegistration[] = await LocationRegistrationModel.find({eventRegId: eventRegistration.eventRegId}, {
                    _id: 0,
                    __v: 0
                }, {sort: {'locationTime': 1}});


                if (locationRegistrations) {
                    const shipLocation = {
                        "locationsRegistrations": locationRegistrations,
                        "color": eventRegistration.trackColor,
                        "shipId": eventRegistration.shipId,
                        "teamName": eventRegistration.teamName
                    }
                    shipLocations.push(shipLocation)
                }
            });

            return res.status(200).send(shipLocations);


        } else {
            return res.status(200).send(eventRegistrations);
        }


    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

/**
 * Get the scoreboard by eventId.
 * @param res.status(200).send(scores);
 */
app.get('/locationRegistrations/getScoreboard/:eventId', async (req, res) => {
    try {

        const evId: any = req.params.eventId;
        const eventRegistrations: IEventRegistration[] = await EventRegistrationModel.find({eventId: evId}, {
            _id: 0,
            __v: 0
        });
        const scores: any[] = [];
        if (eventRegistrations.length !== 0) {

            eventRegistrations.forEach(async (eventReg: IEventRegistration) => {

                const locationRegistration: ILocationRegistration[] = await LocationRegistrationModel.find({eventRegId: eventReg.eventRegId}, {
                    _id: 0,
                    __v: 0
                }, {sort: {'locationTime': -1}, limit: 1});
                if (locationRegistration.length !== 0) {
                    const ship: IShip = await ShipModel.findOne({shipId: eventReg.shipId}, {_id: 0, __v: 0});

                    const user: IUser = await UserModel.findOne({emailUsername: ship.emailUsername}, {_id: 0, __v: 0});

                    if (user) {
                        const score: any = {
                            "locationsRegistrations": locationRegistration,
                            "color": eventReg.trackColor,
                            "shipId": eventReg.shipId,
                            "shipName": ship.name,
                            "teamName": eventReg.teamName,
                            "owner": user.firstname + " " + user.lastname
                        };
                        scores.push(score);
                    }
                }
            });

            if (scores.length !== 0) {
                if (scores[0].locationsRegistrations[0].raceScore !== 0) {
                    scores.sort((a, b) => (a.locationsRegistrations[0].raceScore >= b.locationsRegistrations[0].raceScore) ? -1 : 1)

                    for (let i: any = 0; i < scores.length; i++) {
                        scores[i].placement = i + 1;
                    }
                } else {
                    scores.sort((a, b) => (a.shipId > b.shipId) ? 1 : -1)
                }
            }
        }
        return res.status(200).send(scores);
    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});

/**
 * Delete the given event.
 * @param :eventId
 */
app.delete('/locationRegistrations/deleteFromEventRegId/:eventId', async (req, res) => {
    // Checking if authorized
    const verify: boolean = await Auth.Authorize(req, res, "user");
    if (!verify) {
        return res.status(400).send({auth: false, message: 'Not Authorized'});
    }
    try {

        // Finding and deleting the locationRegistrations with the given eventRegId
        const evRegId: any = req.params.eventRegId;
        await LocationRegistrationModel.deleteMany({eventRegId: evRegId}, {});

        res.status(202).json('Deleted');
    } catch (e) {
        res.status(400).json('BAD REQUEST')
    }
});




/**
 * if no target is given page not found is returned
 * @param  return res.status(404).send('Page Not Found');
 */
app.get('*', (req, res) => {
    return res.status(404).send('Page Not Found');
});


export {app}
