import * as jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
import {Request, Response} from "express"
import {AccessToken} from "./access.controller";

dotenv.config({path: 'config/playground.env'}); // NEW

export const Authorize = (req: Request, res: Response, role: string) => {
    // Checks if a token is provided
    const token = req.header('x-access-token');
    if (!token)
        return res.status(401).send({auth: false, message: 'No token provided'});

    // Verifying the token
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err)
            return res.status(500).send({auth: false, message: 'Failed to authenticate token'});

        // Verifying that the request is allowed by the requesting role
        if (role === "admin" && AccessToken.userRole(token) !== "admin")
            return res.status(401).send({auth: false, message: 'Not authorized'});

        return res.status(201).json({auth: true, message: "success"})

    });

}

