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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("../server");
var supertest_1 = __importDefault(require("supertest"));
var checkEvents_1 = require("../controllers/checkEvents");
var api = server_1.app;
describe("test", function () {
    it('should ', function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkEvents_1.timerForTheReminder()];
                case 1:
                    result = _a.sent();
                    if (result) {
                        expect(result).toEqual(true);
                    }
                    else if (!result) {
                        expect(result).toEqual(false);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("It Deletes an eventRegistration", function () {
    it("should run with ID given", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(api).delete("/eventregistrations/1")];
                case 1:
                    result = _a.sent();
                    expect(result.body).toEqual({ message: 'Registration Deleted' });
                    expect(result.status).toEqual(202);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("Finally able to test the post....", function () {
    it("Should insert another eventRegistration", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(api).post("/eventregistrations/signup").send({ shipId: 1, teamName: "asdf", eventCode: "65433456" })];
                case 1:
                    result = _a.sent();
                    expect(result.body).toEqual({ message: "success" });
                    expect(result.status).toEqual(201);
                    return [2 /*return*/];
            }
        });
    }); });
    it("ship already registered", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(api).post("/eventregistrations/signup").send({ shipId: 1, teamName: "asdf", eventCode: "65433456" })];
                case 1:
                    result = _a.sent();
                    expect(result.body).toEqual({ message: "ship already registered to this event" });
                    expect(result.status).toEqual(409);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("Forgot Password", function () {
    it("Should run with the Mail given ", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(api).post('/users/forgot/aljo0025@easv365.dk')];
                case 1:
                    result = _a.sent();
                    expect(result.body).toEqual({ message: 'new pw sent' });
                    expect(result.status).toEqual(202);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("Broadcast feature", function () {
    it("Should post broadcast to DB ", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(api).post('/broadcast').send({ eventId: 1, message: "asdf" })];
                case 1:
                    result = _a.sent();
                    expect(result.body).toEqual({ message: 'Broadcast successfully sent' });
                    expect(result.status).toEqual(201);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Should GET the made Broadcast", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, supertest_1.default(api).post('/getterForBroadcast').send({ emailUsername: "emailUsername" })];
                case 1:
                    result = _a.sent();
                    expect(result.body).toEqual({ message: 'Found the Broadcast - Deleting by email.' });
                    expect(result.status).toEqual(200);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=requirements.test.js.map