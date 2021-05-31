"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mailing = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: 'configs/config.env' });
// tslint:disable-next-line: no-var-requires
const hbs = require('nodemailer-express-handlebars');
// Configuración de handlebars
const hbsConfig = {
    viewEngine: {
        extName: '.hbs',
        partialsDir: path_1.default.join(__dirname, '../controllers/'),
        layoutsDir: path_1.default.join(__dirname, '../controllers/'),
        defaultLayout: ''
    },
    viewPath: path_1.default.join(__dirname, '../controllers/'),
    extName: '.hbs'
};
// Configure transporter NodeMailer
const transporter = nodemailer_1.default.createTransport({
    service: 'web.de',
    auth: { user: process.env.USER, pass: process.env.PASSWORD }
});
class Mailing {
    /**
     * Envia un correo al administrador y copia a los involucrados en el evento
     * @param incident : Incident
     */
    static confirmNewRegistration() {
        return __awaiter(this, void 0, void 0, function* () {
            transporter.use('compile', hbs(hbsConfig));
            const email = {
                from: 'OxBridge Event',
                to: "wadimo6169@revutap.com",
                subject: "Confirmation: ",
                template: 'eventConfirmation'
            };
            yield transporter.sendMail(email);
        });
    }
}
exports.Mailing = Mailing;
//# sourceMappingURL=mailTransport.controller.js.map