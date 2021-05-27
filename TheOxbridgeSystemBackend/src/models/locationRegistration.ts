import {IRacePoint} from "./racePoint";

export {};
import {Document, Model, model, Schema} from 'mongoose';

export interface ILocationRegistration extends Document {
    regId: number,
    eventRegId: number,
    locationTime: Date,
    longtitude: Date,
    latitude: string,
    racePointNumber: number,
    raceScore: number,
    finishTime: Date
}

const ILocationRegistration = new Schema<ILocationRegistration>({

    regId: {type: Number},
    eventRegId: {type: Number},
    locationTime: {type: Date},
    longtitude: {type: Date,},
    latitude: {type: String},
    racePointNumber: {type: Number},
    raceScore: {type: Date},
    finishTime: {type: Date}
});

export const LocationRegistrationModel: Model<ILocationRegistration> = model('racePoint', ILocationRegistration);
