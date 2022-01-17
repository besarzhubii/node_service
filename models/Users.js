let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Users = new Schema({
    name: String, 
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required:true
    },
    likes: {
        type:Number,
        default:0
    },
});

module.exports = mongoose.model("Users", Users);
