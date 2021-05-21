export {};
import {model, Schema} from 'mongoose';

interface UserSchema {

    firstname: String,
    lastname: String,
    usernameMail: String,
    password: Number,
    role: String
}

const schema = new Schema<UserSchema>({

    firstname: {type: String},
    lastname: {type: String},
    usernameMail: {type: String},
    password: {type: Number},
    role: {type: String, required: true}
});

export const UserModel = model<UserSchema>('User', schema);