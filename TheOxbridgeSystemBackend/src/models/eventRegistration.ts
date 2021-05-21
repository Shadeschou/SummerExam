export {};
import {model, Schema} from 'mongoose';

interface EventRegistrationSchema {
    eventRegId: Number,
    shipId: Number,
    eventId: number,
    trackColor: Date,
    teamName: String
}

const schema = new Schema<EventRegistrationSchema>({

    eventRegId: {type: Number},
    shipId: {type: Number},
    eventId: {type: Number},
    trackColor: {type: Date},
    teamName: {type: String},
});

export const EventRegistrationModel = model<EventRegistrationSchema>('EventRegistration', schema);