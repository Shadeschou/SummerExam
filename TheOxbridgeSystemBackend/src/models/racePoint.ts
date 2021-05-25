export {};
import {model, Schema} from 'mongoose';

export interface IRacePoint {
    racePointId: Number,
    type: String,
    firstsecondeventId: Number,
    firsteventId: Number,
    secondsecondeventId: Number,
    secondeventId: Number,
    eventId: Number,
    racePointNumber: Number
}

const RacePointSchema = new Schema<IRacePoint>({

    racePointId: {type: Number},
    type: {type: String},
    firstsecondeventId: {type: Number},
    firsteventId: {type: Number},
    secondsecondeventId: {type: Number},
    secondeventId: {type: Number},
    eventId: {type: Number},
    racePointNumber: {type: Number}
});

export const RacePointModel = model<IRacePoint>('racePoint', RacePointSchema);

