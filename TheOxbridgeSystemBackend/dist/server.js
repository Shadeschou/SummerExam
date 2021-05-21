"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true, get: function () {
            return m[k];
        }
    });
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", {enumerable: true, value: v});
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function (m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.app = void 0;
// import {connect} from "mongoose";
// import * as  express from 'express';
// import session from 'express-session';
// import bcrypt from 'bcrypt';
// import * as cors from 'cors';
// import * as mongoose from 'mongoose';
// import * as bodyParser from 'body-parser';
// import {UserModel} from "./src/models/user";
// import * as jwt from 'jsonwebtoken';
// export const config = require('configs/config.env');
// import 'reflect-metadata';
// import {Request, Response} from 'express';
//
// import UserController from './src/controllers/user.controller';
// import {RouteDefinition} from './src/models/RouteDefinition';
//
// const app = express();
// app.use(cors());
//
// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello there!');
// });
//
// app.listen(config.env.PORT || 3000, () => {
//     console.log('We are now listening on port 3000 (serverside)');
// });
// // Iterate over all our controllers and register our routes
// [
//     UserController
// ].forEach(controller => {
//     // This is our instantiated class
//     const instance                       = new controller();
//     // The prefix saved to our controller
//     const prefix                         = Reflect.getMetadata('prefix', controller);
//     // Our `routes` array containing all our routes for this controller
//     const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);
//
//     // Iterate over all routes and register them to our express application
//     routes.forEach(route => {
//         // It would be a good idea at this point substitute the `app[route.requestMethod]` with a `switch/case` statement
//         // since we can't be sure about the availability of methods on our `app` object. But for the sake of simplicity
//         // this should be enough for now.
//         app[route.requestMethod](prefix + route.path, (req: express.Request, res: express.Response) => {
//             // Execute our method for this path and pass our express request and response object.
//             instance[route.methodName](req, res);
//         });
//     });
// });
//
// app.listen(3000, () => {
//     console.log('Started express on port 3000');
// });
//
// const urlencode = bodyParser.urlencoded({extended: true});
// app.use(express.static('public'));
// app.use(bodyParser.json());
//
// connect('mongodb://localhost:27017/test', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
//
//
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
//
require("reflect-metadata");
const express = __importStar(require("express"));
const app = express();
exports.app = app;
app.get('/', (req, res) => {
    res.send('Hello there!');
});
app.listen(3000, () => {
    console.log('Started express on port 3000');
});
__exportStar(require("./Decorator/Controller"), exports);
__exportStar(require("./Decorator/Get"), exports);
__exportStar(require("./models/RouteDefinition"), exports);
//# sourceMappingURL=server.js.map