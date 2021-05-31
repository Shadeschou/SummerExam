export {};
import {Document, Model, model, Schema} from 'mongoose';

export interface IRacePoint extends Document {
    racePointId: number,
    type: string,
    firstsecondeventId: number,
    firsteventId: number,
    secondsecondeventId: number,
    secondeventId: number,
    eventId: number,
    racePointNumber: number
}

const RacePointSchema = new Schema({

    racePointId: {type: Number},
    type: {type: String},
    firstsecondeventId: {type: Number},
    firsteventId: {type: Number},
    secondsecondeventId: {type: Number},
    secondeventId: {type: Number},
    eventId: {type: Number},
    racePointNumber: {type: Number}
});

export const RacePointModel: Model<IRacePoint> = model('RacePoint', RacePointSchema);





