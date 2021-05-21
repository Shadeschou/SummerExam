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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const bodyParser = __importStar(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser")); // NEW
const dotenv = __importStar(require("dotenv")); // NEW
dotenv.config({path: 'config/playground.env'}); // NEW
exports.app = express_1.default();
exports.app.use(cookie_parser_1.default(process.env.TOKEN_SECRET)); // ERROR
// endpoints.use(cookieParser('ggfu'));  // ERROR
exports.app.use(cors_1.default());
exports.app.use(express_1.default.static('public'));
exports.app.use(bodyParser.json());
exports.app.set('view engine', 'ejs');
exports.app.use(express_session_1.default({
    resave: false,
    saveUninitialized: true,
    secret: process.env.TOKEN_SECRET
}));
//# sourceMappingURL=express.controller.js.map