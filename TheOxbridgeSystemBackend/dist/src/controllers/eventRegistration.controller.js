// export {};
// import {EventModel} from "../models/event";
// import {EventRegistrationModel} from "../models/eventRegistration";
// import {ShipModel} from "../models/ship";
// import {Authorize} from "./authentication.controller"
// import {UserModel} from "../models/user";
//
// const bcrypt = require('bcryptjs');
//
// // Create and Save a new EventRegistration
// exports.create = (req, res) => {
//
//     // Checking if authorized
//     Authorize(req, res, "user", function (err) {
//         if (err)
//             return err;
//
//         // Creating the eventRegistration
//         const registration = new EventRegistrationModel(req.body);
//         module.exports.createRegistration(registration, res, function (err, registration) {
//             if (err)
//                 return err;
//
//             return res.status(201).json();
//         });
//     });
// };
//
// // Checks that all foreignkeys are valid. Creates and save a new EventRegistrationModel. Returns response
// exports.createRegistration = (newRegistration, res, callback) => {
//
//     validateForeignKeys(newRegistration, res, function (err) {
//         if (err)
//             return callback(err);
//
//         // Finding next eventRegId
//         EventRegistrationModel.findOne({}).sort('-eventRegId').exec(function (err, lastEventRegistration) {
//             if (err)
//                 return callback(res.status(500).send({message: err.message || "Some error occurred while retriving eventRegistrations"}));
//             if (lastEventRegistration) {
//                 const iterator: Number = 1;
//                 // Cast Number to Number
//                 newRegistration.eventRegId = iterator + lastEventRegistration.eventRegId;
//             } else
//                 newRegistration.eventRegId = 1;
//
//             newRegistration.save(function (err) {
//                 if (err)
//                     return callback(res.send(err));
//                 return callback(null, newRegistration);
//             });
//         });
//     })
// };
//
// // Retrieve and return all EventRegistrations from the database.
// exports.findAll = (req, res) => {
//
//     // Checking if authorized
//     Authorize(req, res, "admin", function (err) {
//         if (err)
//             return err;
//
//         // Finding all the registrations in the db
//         EventRegistrationModel.find({}, {_id: 0, __v: 0}, (err, eventRegistrations) => {
//             if (err)
//                 return res.status(500).send({message: err.message || "Some error occurred while retriving EventRegistrations"});
//
//             res.status(200).json(eventRegistrations);
//         });
//     });
// };
//
// // Retrieve all eventRegistrations where the given user is a participant
// let counter = 0;
// exports.findEventRegFromUsername = (req, res) => {
//
//     // Checking if authorized
//     Authorize(req, res, "user", function (err, decodedUser) {
//         if (err)
//             return err;
//
//         // Finding ship by emailUsername in the token
//         ShipModel.find({emailUsername: decodedUser.id}, {_id: 0, __v: 0}, null, (err, ships) => {
//             if (err)
//                 return res.status(500).send({message: "Error retrieving ships"});
//
//             ships.forEach(ship => {
//                 counter++;
//                 EventRegistrationModel.find({eventId: req.params.eventId, shipId: ship.shipId}, {
//                     _id: 0,
//                     __v: 0
//                 }, function (err, eventRegistration) {
//                     counter--;
//                     if (err)
//                         return res.status(500).send({message: "Error retrieving eventRegistrations "})
//                     if (eventRegistration)
//                         return res.status(200).send(eventRegistration);
//                 });
//             });
//         });
//     });
// };
//
// // Creating an eventRegistration
// exports.signUp = (req, res) => {
//
//     // Checking if authorized
//     Authorize(req, res, "user", function (err) {
//         if (err)
//             return err;
//
//         // Checks that the eventCode is correct
//         EventModel.findOne({eventCode: req.body.eventCode}, {_id: 0, __v: 0}, null, (err, event) => {
//             if (err)
//                 return res.status(500).send({message: "error retrieving events"});
//             if (!event)
//                 return res.status(404).send({message: "Wrong eventCode"});
//
//             if (event) {
//                 // Checks that the ship isn't already assigned to the event
//                 EventRegistrationModel.findOne({shipId: req.body.shipId, eventId:        event.eventId}, {
//                     _id: 0,
//                     __v: 0
//                 }, null, (err, eventRegistration) => {
//                     if (err)
//                         return res.status(500).send({message: "error retreiving eventRegistrations"});
//
//                     if (eventRegistration)
//                         return res.status(409).send({message: "ship already registered to this event"})
//
//                     if (!eventRegistration) {
//
//                         // Creating the eventRegistration
//                         const registration = new EventRegistrationModel(req.body);
//                         registration.eventId = event.eventId;
//                         module.exports.createRegistration(registration, res, function (err, registration) {
//                             if (err)
//                                 return err;
//
//                             return res.status(201).json();
//                         });
//                     }
//                 })
//             }
//         })
//     });
// }
//
// // Retrieve all participants of the given event
// let pending = 0;
// exports.getParticipants = (req, res) => {
//
//     const participants = [];
//     EventRegistrationModel.find({eventId: req.params.eventId}, {_id: 0, __v: 0}, null, (err, eventRegs) => {
//         if (err)
//             return res.status(500).send({message: "Error retrieving participants"});
//         if (!eventRegs || eventRegs.length === 0)
//             return res.status(404).send({message: "No participants found"});
//
//         if (eventRegs !== 0) {
//             eventRegs.forEach(eventRegistration => {
//                 pending++;
//
//                 ShipModel.findOne({shipId: eventRegistration.shipId}, {_id: 0, __v: 0}, null, (err, ship) => {
//                     if (err)
//                         return res.status(500).send({message: "error retrieving ship"});
//                     if (!ship)
//                         return res.status(404).send({message: "Ship not found"});
//
//                     else if (ship) {
//                         UserModel.findOne({emailUsername: ship.emailUsername}, {
//                             _id: 0,
//                             __v: 0
//                         }, null, (err, user) => {
//                             pending--;
//                             if (err)
//                                 return res.status(500).send({message: "Error retrieving user"});
//                             if (!user)
//                                 return res.status(404).send({message: "User not found"});
//                             if (user) {
//                                 {
//                                     "firstname"
//                                     user.firstname,
//                                         "lastname"
//                                     user.lastname,
//                                         "shipName"
//                                     ship.name,
//                                         "teamName"
//                                     eventRegistration.teamName,
//                                         "emailUsername"
//                                     user.emailUsername,
//                                         "eventRegId"
//                                     eventRegistration.eventRegId
//                                 }
//                                 participants.push(user);
//
//                                 if (pending === 0) {
//                                     return res.status(200).json();
//                                 }
//                             }
//                         });
//                     }
//                 })
//             });
//         }
//     })
// }
//
// // Creating an eventRegistration
// exports.addParticipant = (req, res) => {
//
//     // Checking if authorized
//     Authorize(req, res, "admin", function (err) {
//         if (err)
//             return err;
//
//         // Creates a user if no user corresponding to the given emailUsername found
//         UserModel.findOne({emailUsername: req.body.emailUsername}, {_id: 0, __v: 0}, (err, user) => {
//             if (err)
//                 return res.status(500).send({message: "error retrieving user"});
//             if (!user) {
//
//                 const hashedPassword = bcrypt.hashSync("1234", 10);
//                 const newUser = new UserModel({
//                     "emailUsername": req.body.emailUsername,
//                     "firstname": req.body.firstname,
//                     "lastname": req.body.lastname,
//                     "password": hashedPassword,
//                     "role": "user"
//                 });
//
//                 newUser.save(function (err) {
//                     if (err)
//                         return res.send(err);
//                 });
//             }
//
//             // Creating a ship if a ship with the given name and owned by the given user, doesn't exist
//             ShipModel.findOne({emailUsername: req.body.emailUsername, name: req.body.shipName}, {
//                 _id: 0,
//                 __v: 0
//             }, (err, ship) => {
//                 if (err)
//                     return res.status(500).send({message: "error retrieving ship"});
//                 if (!ship) {
//
//                     const newShip = new ShipModel({"name": req.body.shipName, "emailUsername": req.body.emailUsername});
//
//                     ShipModel.findOne({}).sort('-shipId').exec(function (err, lastShip) {
//                         if (err)
//                             return res.status(500).send({message: err.message || "Some error occurred while retriving ships"});
//                         if (lastShip)
//                             newShip.shipId = lastShip.shipId + 1;
//                         else
//                             newShip.shipId = 1;
//
//                         newShip.save(function (err, savedShip) {
//                             if (err)
//                                 return res.send(err);
//                             const newEventRegistration = new EventRegistrationModel({
//                                 "eventId": req.body.eventId,
//                                 "shipId": savedShip.shipId,
//                                 "trackColor": "Yellow",
//                                 "teamName": req.body.teamName
//                             });
//                             EventRegistrationModel.create(newEventRegistration, res);
//                         });
//                     });
//                 } else {
//                     const newEventRegistration = new EventRegistrationModel({
//                         "eventId": req.body.eventId,
//                         "shipId": ship.shipId,
//                         "trackColor": "Yellow",
//                         "teamName": req.body.teamName
//                     })
//                     EventRegistrationModel.create(newEventRegistration, res);
//                 }
//             })
//         });
//     })
// }
//
// // Updating information on a given participant
// exports.updateParticipant = (req, res) => {
//
//     // Checking if authorized
//     Authorize(req, res, "admin", function (err) {
//         if (err)
//             return err;
//
//         EventRegistrationModel.findOneAndUpdate({eventRegId: req.params.eventRegId}, req.body, (err, eventReg) => {
//             if (err)
//                 return res.status(500).send({message: "Error updating eventRegistration with eventRegId " + req.params.eventRegId});
//             if (eventReg) {
//                 ShipModel.findOneAndUpdate({shipId: eventReg.shipId}, req.body, (err, ship) => {
//                     if (err)
//                         return res.status(500).send({message: "Error updating ship with shipId " + eventReg.shipId});
//                     if (ship) {
//                         UserModel.findOneAndUpdate({emailUsername: ship.emailUsername}, req.body, (err, user) => {
//                             if (err)
//                                 return res.status(500).send({message: "Error updating user with emailUsername " + ship.emailUsername});
//                             if (!user)
//                                 return res.status(404).send({message: "User not found with emailUsername " + ship.emailUsername});
//                             else
//                                 return res.status(200).send({updated: "true"})
//                         })
//                     } else
//                         return res.status(404).send({message: "Ship not found with shipId " + eventReg.shipId});
//                 });
//             } else
//                 return res.status(404).send({message: "EventRegistration not found with eventRegId " + req.params.eventRegId});
//         })
//     });
// }
//
// // Delete an eventRegistration with the specified eventRegId
// exports.delete = (req, res) => {
//
//     // Checking if authorized
//     Authorize(req, res, "all", function (err) {
//         if (err)
//             return err;
//
//         // Finding and deleting the registration with the given regId
//         EventRegistrationModel.findOneAndDelete({eventRegId: req.params.eventRegId}, (err, eventRegistration) => {
//             if (err)
//                 return res.status(500).send({message: "Error deleting eventRegistration with eventRegId " + req.params.eventRegId});
//             if (!eventRegistration)
//                 return res.status(404).send({message: "EventRegistration not found with eventRegId " + req.params.eventRegId});
//             res.status(202).json(eventRegistration);
//         });
//     });
// };
//
// // Validator for all eventRegistrations foreignkeys
// function validateForeignKeys(registration, res, callback) {
//     // Checking if ship exists
//     ShipModel.findOne({shipId: registration.shipId}, function (err, ship) {
//         if (err)
//             return callback(res.status(500).send({message: err.message || "Some error occurred while retriving ships"}));
//         if (!ship)
//             return callback(res.status(404).send({message: "Ship with id " + registration.shipId + " was not found"}));
//
//         // Checking if event exists
//         EventModel.findOne({eventId: registration.eventId}, function (err, event) {
//             if (err)
//                 return callback(res.status(500).send({message: err.message || "Some error occurred while retriving races"}));
//             if (!event)
//                 return callback(res.status(404).send({message: "Race with id " + registration.eventId + " was not found"}));
//
//             return callback();
//         });
//     });
// }
//# sourceMappingURL=eventRegistration.controller.js.map