export {};
import {model, Schema} from 'mongoose';

interface LocationRegistrationSchema {
    regId: Number,
    eventRegId: Number,
    locationTime: Date,
    longtitude: Date,
    latitude: String,
    racePointNumber: Number,
    raceScore: Date,
    finishTime: Date
}

const schema = new Schema<LocationRegistrationSchema>({

    regId: {type: Number},
    eventRegId: {type: Number},
    locationTime: {type: Date},
    longtitude: {type: Date,},
    latitude: {type: String},
    racePointNumber: {type: Number},
    raceScore: {type: Date},
    finishTime: {type: Date}
});

export const LocationRegistrationModel = model<LocationRegistrationSchema>('LocationRegistration', schema);