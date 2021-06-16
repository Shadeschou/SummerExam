import * as dotenv from 'dotenv';
import {Request, Response} from 'express';
import {AccessToken} from './accessToken.controller'

dotenv.config({path: 'config/config.env'}); // NEW
// Authenticate the given user compared to its roll, and ensure he cannot access the wrong stuff.
export class Auth {
    static async Authorize(req: Request, res: Response, role: string): Promise<boolean> {
        // Checks if a token is provided
        const token = req.header('x-access-token');
        const verify: Promise<boolean> = this.verify(token, process.env.TOKEN_SECRET, role);
        if (!verify) {
            return false;
        } else if (verify) {
            return true;
        }
    }

    // Verifying the token
    static async verify(token: any, secret: string, role: string): Promise<boolean> {

        // Verifying that the request is allowed by the requesting role
        if (role === "admin" && AccessToken.userRole(token) !== "admin")
            return false;
        else
            return true;
    }
    static async getUser(req: Request, res: Response) {
        const token = req.header('x-access-token');
        const user: any = AccessToken.getUser(token);
        return user;
    }
}

