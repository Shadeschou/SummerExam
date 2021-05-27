import {model, Schema, Model, Document} from 'mongoose';

 interface IEventRegistration extends Document {
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


 const EventRegistrationModel: Model<IEventRegistration> = model('EventRegistration', EventRegistrationSchema);

export {IEventRegistration,EventRegistrationModel };