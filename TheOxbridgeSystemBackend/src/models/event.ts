export {};
import {Model, model, Schema} from 'mongoose';

export interface IEvent {
    eventId: number,
    name: String,
    eventStart: Date,
    eventEnd: Date,
    city: String,
    eventCode: String,
    actualEventStart: Date,
    isLive: Boolean
}

const EventSchema = new Schema<IEvent>({

    eventId: {type: Number},
    name: {type: String},
    eventStart: {type: Date},
    eventEnd: {type: Date},
    city: {type: String},
    eventCode: {type: String},
    actualEventStart: {type: Date},
    isLive: {type: Boolean}
});

export const Event: Model<IEvent> = model('Event', EventSchema);


