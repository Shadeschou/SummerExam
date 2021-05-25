export {};
import {model, Schema} from 'mongoose';

export interface IUser {

    firstname: String,
    lastname: String,
    usernameMail: String,
    password: Number,
    role: String
}

const UserModelSchema = new Schema<IUser>({

    firstname: {type: String},
    lastname: {type: String},
    usernameMail: {type: String},
    password: {type: Number},
    role: {type: String, required: true}
});

export const UserModel = model<IUser>('User', UserModelSchema);