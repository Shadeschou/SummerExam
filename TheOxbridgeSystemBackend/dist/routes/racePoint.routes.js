"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
module.exports = (app) => {
    const racePoint = require('../controllers/racePoint.controller.ts');
    // Retrieve start and finish racepoints from an specific event
    app.get('/racePoints/findStartAndFinish/:eventId', racePoint.findStartAndFinish);
    // Retrieve all racepoints from an specific event
    app.get('/racepoints/fromEventId/:eventId', racePoint.findAllEventRacePoints);
    // Creates a new route of racepoints for an event
    app.post('/racepoints/createRoute/:eventId', racePoint.createRoute);
};
//# sourceMappingURL=racePoint.routes.js.map