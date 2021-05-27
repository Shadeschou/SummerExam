// import { connect } from "mongoose";
// import express from 'express';
// import cors from 'cors';
// import * as mongoose from 'mongoose';
// import * as bodyParser from 'body-parser';
// import dotenv from 'dotenv';
// import { Event, IEvent } from "src/models/event";
// import { Auth } from 'src/controllers/authentication.controller'
// import { EventRegistration, IEventRegistration } from 'src/models/eventRegistration'
// import { RacePoint, IRacePoint } from 'src/models/racePoint'
// import { AccessToken } from "src/controllers/accessToken";
// import { Ship, IShip } from 'src/models/ship'
//
// dotenv.config({ path: 'config/config.env' });
//
//
//
// const app = express();
//
// app.use(cors());
//
// const urlencode = bodyParser.urlencoded({ extended: true });
// app.use(express.static('public'));
// app.use(bodyParser.json());
//
// connect(process.env.DB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
//
//
// // ROUTING
// const router = express.Router();
//
// // TO PROCESS THE NEXT REQUEST !!
// router.use(function (req, res, next) {
//     console.log("recieved a request now, ready for the next");
//     next();
// });
//
// app.use('/', router);
// // FINDALL EVENTS
// app.get('/events', async (req, res) => {
//     try {
//         const events: IEvent[] = await Event.find({}, { _id: 0, __v: 0 });
//         res.status(201).json(events);
//     } catch (e) {
//         res.status(400).send('BAD REQUEST')
//     }
// });
// // POST EVENT
// app.post('/events', async (req, res) => {
//     try {
//         const verify: Boolean = await Auth.Authorize(req, res, req.params.role);
//         if (!verify) {
//             return res.status(400).send({ auth: false, message: 'Not Authorized' });
//         }
//         const event = new Event(req.body);
//         const one: any = 1;
//         const lastEvent: IEvent = await Event.findOne({}).sort('desc');
//
//         if (lastEvent) {
//             event.eventId = lastEvent.eventId + one;
//         }
//         else {
//             event.eventId = 1;
//         }
//
//
//         // Saving the new Event in the DB
//         event.save();
//         res.status(201).json(event);
//
//
//
//     } catch (e) {
//         res.status(400).send('BAD REQUEST')
//     }
// });
// // FIND SINGLE EVENT
// app.get('/events/:eventId', async (req, res) => {
//     try {
//         const evId: any = req.params.eventId;
//         const event: IEvent = await Event.findOne({ eventId: evId }, { _id: 0, __v: 0 });
//
//         if (!event) {
//             res.status(400).send('Event not found');
//         }
//         else {
//             res.status(200).send(event);
//         }
//     } catch (e) {
//         res.status(400).send('BAD REQUEST');
//     }
// });
//
// // UPDATE EVENT
// app.put('/events/:eventId', async (req, res) => {
//     try {
//         const verify: Boolean = await Auth.Authorize(req, res, req.params.role);
//         if (!verify) {
//             return res.status(400).send({ auth: false, message: 'Not Authorized' });
//         }
//         const newEvent: any = req.body;
//         const evId: any = req.params.eventId;
//         newEvent.eventId = req.params.eventId;
//         Event.updateOne({ eventId: evId }, newEvent);
//         res.status(202).json(newEvent);
//     } catch (e) {
//         res.status(400).send('BAD REQUEST');
//     }
//
//
//
// });
//
// app.delete('/events/:eventId', async (req, res) => {
//     try {
//         // Checking if authorized
//         const verify: Boolean = await Auth.Authorize(req, res, req.params.role);
//         if (!verify) {
//             return res.status(400).send({ auth: false, message: 'Not Authorized' });
//         }
//         const evId: any = req.params.eventId;
//         // Finding and the deleting the event with the given eventId
//         Event.findOneAndDelete({ eventId: evId });
//         // Finding and deleting every EventRegistration with the given eventId
//         EventRegistration.deleteMany({ eventId: evId });
//         // Finding and deleting every RacePoint with the given eventId
//         RacePoint.deleteMany({ eventId: evId });
//         res.status(202).send('Event deleted');
//
//
//
//
//
//     } catch (e) {
//         res.status(400).send('BAD REQUEST')
//     }
// });
//
// // Updating event property "isLive" to true
// app.put('/events/startEvent/:eventId', async (req, res) => {
//     try {
//         // Checking if authorized
//         const verify: Boolean = await Auth.Authorize(req, res, req.params.role);
//         if (!verify) {
//             return res.status(400).send({ auth: false, message: 'Not Authorized' });
//         }
//         const evId: any = req.params.eventId;
//         const updatedEvent = { isLive: true, actualEventStart: req.body.actualEventStart }
//         Event.findOneAndUpdate({ eventId: evId }, updatedEvent, { new: true });
//         res.status(202).send('Event is now Live');
//
//
//     } catch (e) {
//         res.status(400).send('BAD REQUEST')
//     }
// });
//
// app.get('/events/stopEvent/:eventId', async (req, res) => {
//     try {
//         // Checking if authorized
//         const verify: Boolean = await Auth.Authorize(req, res, req.params.role);
//         if (!verify) {
//             return res.status(400).send({ auth: false, message: 'Not Authorized' });
//         }
//         const evId: any = req.params.eventId;
//         Event.findOneAndUpdate({ eventId: evId }, { isLive: false }, { new: true });
//         res.status(202).send('Event Stopped');
//     } catch (e) {
//         res.status(400).send('BAD REQUEST')
//     }
// });
//
// app.get('/events/hasRoute/:eventId', async (req, res) => {
//     try {
//         const evId: any = req.params.eventId;
//         const racepoints: IRacePoint[] = await RacePoint.find({ eventId: evId }, { _id: 0, __v: 0 });
//         if (racepoints && racepoints.length !== 0)
//             return res.status(200).send(true);
//         else
//             return res.status(200).send(false);
//
//     } catch (e) {
//         res.status(400).send('BAD REQUEST')
//     }
// });
//
// app.get('/events/myEvents/findFromUsername', async (req, res) => {
//     try {
//         // Checking if authorized
//         const verify: Boolean = await Auth.Authorize(req, res, req.params.role);
//         if (!verify) {
//             return res.status(400).send({ auth: false, message: 'Not Authorized' });
//         }
//         // Finding all the ships the user owns
//         const events: any[] = new Array;
//         const ships: IShip[] = await Ship.find({ emailUsername: req.params.emailUsername }, { _id: 0, __v: 0 });
//
//         if (ships.length > 0) {
//             // Finding all eventRegistrations with a ship that the user owns
//             ships.forEach( async (ship:IShip) => {
//                 const eventRegistrations: IEventRegistration[] = await EventRegistration.find({ shipId: ship.shipId }, { _id: 0, __v: 0 });
//                 if (eventRegistrations) {
//                     eventRegistrations.forEach( async (eventRegistration:IEventRegistration) => {
//                         pending++;
//                         const ship: IShip = await Ship.findOne({ shipId: eventRegistration.shipId }, { _id: 0, __v: 0 });
//                         if (ship) {
//                             const event: IEvent = await Event.findOne({ eventId: eventRegistration.eventId }, { _id: 0, __v: 0 });
//                             pending--
//                             if (event) {
//                                 events.push({ "eventId": event.eventId, "name": event.name, "eventStart": event.eventStart, "eventEnd": event.eventEnd, "city": event.city, "eventRegId": eventRegistration.eventRegId, "shipName": ship.name, "teamName": eventRegistration.teamName, "isLive": event.isLive, "actualEventStart": event.actualEventStart });
//                             }
//                             if (pending == 0) {
//                                 res.status(200).send(events);
//                             }
//
//                         }
//
//
//                     });
//                 }
//             });
//
//         } else {
//             res.status(200).send(events);
//         }
//
//
//
//
//     } catch (e) {
//         res.status(400).send('BAD REQUEST')
//     }
// });
//
//
//
//
//
//
// export { app }
//# sourceMappingURL=event.controller.js.map