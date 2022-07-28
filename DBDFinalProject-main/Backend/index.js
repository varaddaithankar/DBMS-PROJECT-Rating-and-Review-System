const express = require('express');
const cors = require('cors');
const bodyParser =require('body-parser');
const mongoose =require('mongoose');

app=express();


app.use(bodyParser.json());
app.use(cors());
//const nosql=require('./nosql.js')

var loginRoutes = require('./routes/login');
var signupRoutes = require('./routes/signup');
var searchBookRoutes = require('./routes/searchBook');
var updateUserDataRoutes = require('./routes/updateUserData');
var bookDetailsRoutes = require('./routes/bookDetails');
var ratingRoutes = require('./routes/rating');
var fetchByStatusRoutes = require('./routes/fetchByStatus');
var updateStatusRoutes = require('./routes/updateStatus');
var getStatus = require('./routes/getStatus');

app.use('/login',loginRoutes);
app.use('/signup',signupRoutes);
app.use('/searchBook',searchBookRoutes);
app.use('/updateUserData',updateUserDataRoutes);
app.use('/bookDetails',bookDetailsRoutes);
app.use('/rating',ratingRoutes);
app.use('/status',fetchByStatusRoutes);
app.use('/updatestatus',updateStatusRoutes);
app.use('/getStatus',getStatus);

app.listen(3002,() =>{
    console.log("Server started on port 3002");
});
