const express = require('express');
const router = express();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//models
const User = require('../../models/Users');

router.post('/signup', async (req,res) => {

    const {
        username,
        name,
        password
    } = req.body;
    if(!(username && password && name)){
        return res.status(400).send("All input is required");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
        name,
        username,
        password: hashedPassword
    });

    try{
        const savedUser = await newUser.save();
        res.send(savedUser);
    }catch(err){
        res.status(400).send('User already exists!');
    }
});

router.post('/login', async (req,res) => {
    const {
        username,
        password
    } = req.body;

    if(!(username && password)){
        return res.status(400).send("All input is required");
    }

    const user = await User.findOne({username});
    
    if(!user){
        return res.status(400).send("Username or password is incorrect. Please try again!");
    }

    let checkPassword = await bcrypt.compare(password, user?.password);

    if(!checkPassword){
        return res.status(400).send("Username or password is incorrect. Please try again!");
    }

    const jwtInfo = {
        username,
        _id:user['_id'],
    }
    
    let jwToken = await jwt.sign(jwtInfo, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.send(jwToken);
});

router.get('/user/:id', async (req,res) => {
    const { id } = req.params;

    let user;
    try{
        user = await User.findById(id,['username','likes']);
    }catch(err){
        return res.status(400).send(err);
    }
    if(user){
        res.send(user);
    }else{
        res.status(400).send('User not found');
    }
});

router.get('/most-liked', async (req,res) => {
    try{
        const users = await User.find({},['-password'],{sort:{likes:-1}});
        res.send(users);
    }catch(err){
        res.status(400).send(err);
    }
});

module.exports = router;