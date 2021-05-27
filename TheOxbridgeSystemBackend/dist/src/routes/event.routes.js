// export {};
// module.exports = (app) => {
//     const events = require('../controllers/event.controller.ts');
//
//     // Create an new event
//     // app.post('/events', events.create); //TODO Get help from Tommy to find the last even and increment.
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
//# sourceMappingURL=event.routes.js.map