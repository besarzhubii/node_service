const express = require('express');
let app = express();
let mongoose = require('mongoose');
const userAuth = require("./middleware/userAuth");
const dotenv = require('dotenv')

dotenv.config();

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("connected");
});
//unprotected routes import
let usersUnprotected = require('./routes/unprotected/users');

//protected routes import
let usersProtected = require('./routes/protected/user');


app.use(express.json())

//Define routes
app.use('/api', usersUnprotected);
app.use('/api', userAuth, usersProtected);

app.listen(3000, () => {
    console.log('Server is up and running in port 3000');
})