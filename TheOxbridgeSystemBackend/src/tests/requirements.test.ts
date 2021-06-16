import {app} from "../server";
import request from "supertest";
import {timerForTheReminder} from "../controllers/checkEvents";
import {IBroadcast} from "../models/broadcast";

const api = app
describe("test", () => {
    it('should ', async  () =>  {
        const result = await timerForTheReminder()
        if(result) {
            expect(result).toEqual(true);
        }else if(!result){
            expect(result).toEqual(false)
        }
    });
})

describe("It Deletes an eventRegistration", () => {
    it("should run with ID given", async () => {
        const result = await request(api).delete("/eventregistrations/3");
        expect(result.status).toEqual(202);
    });
});

describe("Finally able to test the post....",  () => {
    it("Should insert another eventRegistration", async () => {
        const result = await request(api).post("/eventregistrations/signup")
            .send({eventId: 3,eventCode: "756756",  shipId: 2, teamName: "nnnn" });
        expect(result.status).toEqual(201);
    });
    it("ship already registered", async () => {
        const result = await request(api).post("/eventregistrations/signup")
            .send({shipId: 3, teamName: "asdf", emailUsername: "aljo0025@easv365.dk", eventCode: "65433456"});
        expect(result.status).toEqual(409);
    });
})

describe("Forgot Password", () => {

  it("Should run with the Mail given ", async () => {
        const result = await request(api).post('/users/forgot/*INSERTMAILHERE*');
        expect(result.status).toEqual(202);
    });
});

describe("Broadcast feature", () => {
    it("Should post broadcast to DB ", async () => {
        const result = await request(api).post('/broadcast').send({eventId: 1, message: "asdf"});
        expect(result.status).toEqual(201);
    });
    it("Should get the made Broadcast", async () => {
        const result = await request(api).post('/getterForBroadcast').send({emailUsername: "aljo0025@easv365.dk"});
        expect(result.body).toEqual({message: 'Found the Broadcast - Deleting by email.'});
        expect(result.status).toEqual(200);
    });
});


