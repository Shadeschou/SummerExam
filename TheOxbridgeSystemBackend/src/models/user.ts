import {Document, Model, model, Schema} from 'mongoose';

export interface IUser extends Document {
    firstname: string,
    lastname: string,
    emailUsername: string,
    password: string,
    role: string,
    teamImage: BufferSource

}

const UserModelSchema = new Schema({


    firstname: {type: String},
    lastname: {type: String},
    emailUsername: {type: String},
    password: {type: String},
    role: {type: String, required: true}
});

export const UserModel: Model<IUser> = model('User', UserModelSchema);
