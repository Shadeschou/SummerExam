export {};
import {model, Schema} from 'mongoose';

export interface ShipSchema {
    shipId: Number,
    emailUsername: String,
    name: String,

}

const schema = new Schema<ShipSchema>({

    shipId: {type: Number, required: false},
    emailUsername: {type: String, required: false},
    name: {type: String, required: false},

});

export const ShipModel = model<ShipSchema>('Ship', schema);