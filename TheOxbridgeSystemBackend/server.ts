// BASE FOR THE SERVER (importing libaries)
export {};
import bodyParser from "body-parser";
import express from 'express';

import {Request, Response} from 'express';
import cors from 'cors';
import 'reflect-metadata';
import UserController from 'controllers/user.controller';
import {RouteDefinition} from 'models/RouteDefinition';
import dotenv from "dotenv"
import {connect} from "mongoose";

dotenv.config({path:'configs/config.env'});
const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello there!');
});

// Iterate over all our controllers and register our routes
[
    UserController
].forEach(controller => {
    // This is our instantiated class
    const instance                       = new controller();
    // The prefix saved to our controller
    const prefix                         = Reflect.getMetadata('prefix', controller);
    // Our `routes` array containing all our routes for this controller
    const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);

    // Iterate over all routes and register them to our express application
    routes.forEach(route => {
        // It would be a good idea at this point to substitute the `app[route.requestMethod]` with a `switch/case` statement
        // since we can't be sure about the availability of methods on our `app` object. But for the sake of simplicity
        // this should be enough for now.
        app[route.requestMethod](prefix + route.path, (req: express.Request, res: express.Response) => {
            // Execute our method for this path and pass our express request and response object.
            instance[route.methodName](req, res);
        });
    });
});

app.listen(3000, () => {
    console.log('Started express on port 3000');
});

const urlencode = bodyParser.urlencoded({extended: true});
app.use(express.static('public'));
app.use(bodyParser.json());

connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

export {app}
export * from './Decorator/Controller';
export * from './Decorator/Get';
export * from './models/RouteDefinition';