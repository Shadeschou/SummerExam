var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstname: 
    {
        type: String, required: true
    },
    lastname: {
        type: String, required: true
    },

     usernameMail: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
    role:{
        type: String,
      },
});
module.exports = mongoose.model('User', UserSchema);