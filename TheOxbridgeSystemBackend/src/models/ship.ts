export {};
import {Document, Model, model, Schema} from 'mongoose';

export interface IShip extends Document  {
    shipId: number,
    emailUsername: string,
    name: string,

}

const ShipModelSchema = new Schema({

    shipId: {type: Number, required: false},
    emailUsername: {type: String, required: false},
    name: {type: String, required: false},

});

export const ShipModel:Model<IShip> = model('Ship', ShipModelSchema);
