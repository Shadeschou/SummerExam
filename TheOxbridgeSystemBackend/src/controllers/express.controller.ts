import express from 'express';
import session from 'express-session';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'; // NEW
import * as dotenv from 'dotenv'; // NEW
dotenv.config({path: 'config/playground.env'}); // NEW

export const app = express();
app.use(cookieParser(process.env.TOKEN_SECRET));  // ERROR
// endpoints.use(cookieParser('ggfu'));  // ERROR
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.TOKEN_SECRET
}));

