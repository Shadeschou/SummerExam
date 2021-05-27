import {model, Schema} from "mongoose";



export interface IEventRegistration {
    eventRegId: Number,
    shipId: Number,
    eventId: number,
    trackColor: Date,
    teamName: String
}

const EventRegistrationSchema = new Schema<IEventRegistration>({

    eventRegId: {type: Number},
    shipId: {type: Number},
    eventId: {type: Number},
    trackColor: {type: Date},
    teamName: {type: String},
});

export const EventRegistration= model<IEventRegistration>('EventRegistration', EventRegistrationSchema);