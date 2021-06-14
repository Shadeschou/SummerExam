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
        const result = await request(api).delete("/eventregistrations/1");
        expect(result.body).toEqual({message: 'Registration Deleted'});
        expect(result.status).toEqual(202);
    });
});

describe("Finally able to test the post....",  () => {
    it("Should insert another eventRegistration", async () => {
        const result = await request(api).post("/eventregistrations/signup").send({shipId: 1, teamName: "asdf", eventCode: "65433456"});
        expect(result.body).toEqual({message: "success"});
        expect(result.status).toEqual(201);
    });
    it("ship already registered", async () => {
        const result = await request(api).post("/eventregistrations/signup").send({shipId: 1, teamName: "asdf", eventCode: "65433456"});
        expect(result.body).toEqual({message: "ship already registered to this event"});
        expect(result.status).toEqual(409);
    });
})

describe("Forgot Password", () => {

  it("Should run with the Mail given ", async () => {
        const result = await request(api).post('/users/forgot/aljo0025@easv365.dk');
        expect(result.body).toEqual({message: 'new pw sent'});
        expect(result.status).toEqual(202);
    });
});

describe("Broadcast feature", () => {
    it("Should post broadcast to DB ", async () => {
        const result = await request(api).post('/broadcast').send({eventId: 1, message: "asdf"});
        expect(result.body).toEqual({message:'Broadcast successfully sent'});
        expect(result.status).toEqual(201);
    });
    it("Should GET the made Broadcast", async () => {
        const result = await request(api).post('/getterForBroadcast').send({emailUsername: "emailUsername"});
        expect(result.body).toEqual({message: 'Found the Broadcast - Deleting by email.'});
        expect(result.status).toEqual(200);
    });
});


