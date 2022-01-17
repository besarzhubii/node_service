let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UsersLikes = new Schema({
    currentUser: Schema.Types.ObjectId,
    likedUser: Schema.Types.ObjectId
});

module.exports = mongoose.model("UsersLikes", UsersLikes);
