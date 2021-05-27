export {};
import {Document, Model, model, Schema} from 'mongoose';

export interface IEvent extends Document {
    eventId: number,
    name: string,
    eventStart: Date,
    eventEnd: Date,
    city: string,
    eventCode: string,
    actualEventStart: Date,
    isLive: boolean
}

const IEventSchema = new Schema<IEvent>({

    eventId: {type: Number},
    name: {type: String},
    eventStart: {type: Date},
    eventEnd: {type: Date},
    city: {type: String},
    eventCode: {type: String},
    actualEventStart: {type: Date},
    isLive: {type: Boolean}
});


export const EventModel: Model<IEvent> = model('racePoint', IEventSchema);


