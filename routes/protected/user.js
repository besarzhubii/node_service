const express = require('express');
const router = express();
const User = require('../../models/Users');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const UsersLikes = require('../../models/UsersLikes');

//middlewares
const userAction = require('../../middleware/userAction');

router.get('/me', async (req,res) => {
    try{
        const user = await User.findById(req.user._id, ['-password']);
        res.send(user);
    }catch(err){
        res.status(500).send(err);
    }
})

router.put('/me/update-password', async (req,res) => {
    let user;
    const {
        oldPassword,
        newPassword
    } = req.body;
    try{
        user = await User.findById(req.user._id);
    }catch(err){
        return res.status(500).send(err);
    }
    
    let checkPassword = await bcrypt.compare(oldPassword, user?.password);

    if(!checkPassword){
        return res.status(400).send('Your old password does not match! Please try again!');
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    try{
        const updatedUser = await User.findByIdAndUpdate(req.user._id,{password: hashedPassword});
        res.send(updatedUser);
    }catch(err){
        res.status(500).send(err);
    }
})

router.put('/user/:id/like', userAction, async (req,res) => {
    const { id } = req.params;
    let userAction = req.userAction;
    if(!!userAction){
        return res.status(400).send('You already liked this user');
    } 

    let likedUser;
    try{
        likedUser = await User.findByIdAndUpdate(id,{$inc:{likes:1}});
    }catch(err){
        return res.sendStatus(500).send(err);
    }
    
    let usersLikes = new UsersLikes({
        currentUser: req.user._id,
        likedUser: id
    });

    try{
        let finalLiked = await usersLikes.save();
        res.send(finalLiked);
    }catch(err){
        return res.status(500).send(err);
    }
})

router.put('/user/:id/unlike', userAction, async (req,res) => {
    const { id } = req.params;
    let userAction = req.userAction;
    if(!userAction){
        return res.status(400).send('You do not like this user');
    }

    let likedUser;
    try{
        likedUser = await User.findByIdAndUpdate(id,{$inc:{likes:-1}});
    }catch(err){
        return res.status(500).send(err);
    }
    
    try{
        let deletedLiked = await UsersLikes.deleteOne({
            currentUser: req.user._id,
            likedUser: id
        });
        res.send(deletedLiked);
    }catch(err){
        return res.status(500).send(err);
    }
})

module.exports = router;