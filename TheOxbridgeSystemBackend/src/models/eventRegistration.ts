import {model, Schema, Model, Document} from 'mongoose';

export interface IEventRegistration extends Document {
    eventRegId: number,
    shipId: number,
    eventId: number,
    trackColor: Date,
    teamName: string
}

const EventRegistrationSchema = new Schema<IEventRegistration>({

    eventRegId: {type: Number},
    shipId: {type: Number},
    eventId: {type: Number},
    trackColor: {type: Date},
    teamName: {type: String},
});


export const EventRegistrationModel: Model<IEventRegistration> = model('racePoint', EventRegistrationSchema);