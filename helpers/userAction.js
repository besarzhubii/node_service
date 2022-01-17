const UsersLikes = require('../models/UsersLikes');

const userAction = async (id, likedUserId) => {
    let usersLikes;
    try{
        usersLikes = await UsersLikes.findOne({
            currentUser: id,
            likedUser: likedUserId
        });
    }catch(err){
        return null;
    }
    return usersLikes;
}

module.exports = userAction;
