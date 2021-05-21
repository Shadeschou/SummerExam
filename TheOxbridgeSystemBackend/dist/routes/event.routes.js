"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", {value: true});
// module.exports = (app) => {
//     const events = require('../controllers/event.controller.ts');
//
//     // Create an new event
//     app.post('/events', events.create);
//
//     // Retrieve all events
//     app.get('/events', events.findAll);
//
//     // Retrieve a single Event with eventId
//     app.get('/events/:eventId', events.findOne);
//
//     // Update an Event with given eventId
//     app.put('/events/:eventId', events.update);
//
//     // Delete an Event with given eventId
//     app.delete('/events/:eventId', events.delete);
//
//     // Updating event property "isLive" to true
//     app.put('/events/startEvent/:eventId', events.StartEvent);
//
//     // Updating event property "isLive" to false
//     app.get('/events/stopEvent/:eventId', events.StopEvent);
//
//     // Checks if event with given eventId has a route
//     app.get('/events/hasRoute/:eventId', events.hasRoute);
//
//     // Retrieve all events with participant corresponding to primarykey of user, supplied from the token
//     app.get('/events/myEvents/findFromUsername', events.findFromUsername);
// }
let UserController = class UserController {
    index() {
        // return proper response
    }

    details() {
        // return proper response
    }
};
__decorate([
    Route('/')
], UserController.prototype, "index", null);
__decorate([
    Route('/:name')
], UserController.prototype, "details", null);
UserController = __decorate([
    Controller('/events')
], UserController);
//# sourceMappingURL=event.routes.js.map