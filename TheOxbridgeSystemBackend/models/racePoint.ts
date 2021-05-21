export {};
import {model, Schema} from 'mongoose';

interface racePointSchema {
    racePointId: Number,
    type: String,
    firstsecondeventId: Number,
    firsteventId: Number,
    secondsecondeventId: Number,
    secondeventId: Number,
    eventId: Number,
    racePointNumber: Number
}

const schema = new Schema<racePointSchema>({

    racePointId: {type: Number},
    type: {type: String},
    firstsecondeventId: {type: Number},
    firsteventId: {type: Number},
    secondsecondeventId: {type: Number},
    secondeventId: {type: Number},
    eventId: {type: Number},
    racePointNumber: {type: Number}
});

export const RacePointModel = model<racePointSchema>('racePoint', schema);
