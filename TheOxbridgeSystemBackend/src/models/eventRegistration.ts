import {Document, Model, model, Schema} from 'mongoose';

interface IEventRegistration extends Document {
    eventRegId: number,
    shipId: number,
    eventId: number,
    trackColor: string,
    teamName: string,
    emailUsername: string,
    mailRecieved: boolean,
}

const EventRegistrationSchema = new Schema<IEventRegistration>({

    eventRegId: {type: Number},
    shipId: {type: Number},
    eventId: {type: Number},
    trackColor: {type: String},
    teamName: {type: String},
    emailUsername: {type: String},
    mailRecieved: {
        type: Boolean,
        default: false
    }
});


const EventRegistrationModel: Model<IEventRegistration> = model('EventRegistration', EventRegistrationSchema);

export {IEventRegistration, EventRegistrationModel};
