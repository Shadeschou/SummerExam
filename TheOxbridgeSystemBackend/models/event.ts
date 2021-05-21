export {};
import {model, Schema} from 'mongoose';

interface EventSchema {
    eventId: number,
    name: String,
    eventStart: Date,
    eventEnd: Date,
    city: String,
    eventCode: String,
    actualEventStart: Date,
    isLive: Boolean
}

const schema = new Schema<EventSchema>({

    eventId: {type: Number},
    name: {type: String},
    eventStart: {type: Date},
    eventEnd: {type: Date},
    city: {type: String},
    eventCode: {type: String},
    actualEventStart: {type: Date},
    isLive: {type: Boolean}
});

export const EventModel = model<EventSchema>('Event', schema);
