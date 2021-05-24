export {};
import {Model, model, Schema} from 'mongoose';


interface IEventRegistrationSchema {
    eventRegId: Number,
    shipId: Number,
    eventId: number,
    trackColor: Date,
    teamName: String
}

const EventRegistrationSchema = new Schema<IEventRegistrationSchema>({

    eventRegId: {type: Number},
    shipId: {type: Number},
    eventId: {type: Number},
    trackColor: {type: Date},
    teamName: {type: String},
});

const EventRegistrationModel = model<IEventRegistrationSchema>('EventRegistration', EventRegistrationSchema);

export {EventRegistrationModel, IEventRegistrationSchema}