const UsersLikes = require('../models/UsersLikes');

const userAction = async (req, res, next) => {
    const { id } = req.params;
    let usersLikes;
    
    try{
        usersLikes = await UsersLikes.findOne({
            currentUser: req.user._id,
            likedUser: id
        });
        req.userAction = usersLikes;
    }catch(err){
        return res.status(500).send(err);
    }
    return next();
}

module.exports = userAction;
