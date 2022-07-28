const express = require('express');
const cors = require('cors');
const router =express.Router();
const bodyParser = require('body-parser');
const connection = require('../database');
router.use(bodyParser.json());
router.use(cors());
/*
    --------------------------------------------------------------------------------------------------------
                                        SIGN UP PAGE
    --------------------------------------------------------------------------------------------------------

    INPUT : {firstname, lastname, email, password}
    PROCESS : try to Insert these values into database, If error exists then return user already exists 
                else redirect to login page
    OUTPUT : Message saying successfully registered 
*/
router.post('/',(req,res) =>{    
    console.log("from signup ",req.body);
    const sql = `Insert into rec_db.user (f_name,l_name,e_mail,user_image,password) values ('${req.body.firstName}','${req.body.lastName}','${req.body.email}','${req.body.image}','${req.body.password}')`;
    connection.query(sql,(err,result)=>{
        if(err){
            res.send("User Already exists");
        }
        else{
            res.send("Successfully registered. Please Login");
        }
    })
    
});
module.exports = router;