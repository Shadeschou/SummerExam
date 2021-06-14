"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var jwt_decode_1 = __importDefault(require("jwt-decode"));
var expiresIn = '2h';
var AccessToken = /** @class */ (function () {
    function AccessToken() {
    }
    AccessToken.generateToken = function (role) {
        var t = jsonwebtoken_1.default.sign({ 'role': role }, process.env.TOKEN_SECRET, { expiresIn: expiresIn });
        return t;
    };
    AccessToken.userRole = function (token) {
        var decodedToken = jwt_decode_1.default(token);
        // console.log(decodedToken.role);
        return decodedToken.role;
    };
    AccessToken.getUser = function (token) {
        var decodedToken = jwt_decode_1.default(token);
        // console.log(decodedToken.role);
        return decodedToken;
    };
    return AccessToken;
}());
exports.AccessToken = AccessToken;
//# sourceMappingURL=accessToken.controller.js.map