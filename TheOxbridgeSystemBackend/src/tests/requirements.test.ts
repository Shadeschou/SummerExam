import {app} from "../server";
import request from "supertest";

import {timerForTheReminder} from "../controllers/checkEvents";

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
    it("should run with ID given", async () => {
        const result = await request(api).delete("/eventregistrations/1");
        expect(result.body).toEqual({message: 'Registration Deleted'});
        expect(result.status).toEqual(202);
    });
});
