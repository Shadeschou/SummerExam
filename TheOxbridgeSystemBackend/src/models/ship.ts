export {};
import {model, Schema} from 'mongoose';

interface IShip {
    shipId: Number,
    emailUsername: String,
    name: String,

}

const ShipSchema = new Schema<IShip>({

    shipId: {type: Number, required: false},
    emailUsername: {type: String, required: false},
    name: {type: String, required: false},

});

const ShipModel = model<IShip>('Ship', ShipSchema);
export {ShipModel, IShip}