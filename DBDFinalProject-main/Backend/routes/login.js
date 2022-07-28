const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('../database');


const router =express.Router();
router.use(bodyParser.json());
router.use(cors());
/*
    --------------------------------------------------------------------------------------------------------
                                        LOGIN UP PAGE
    --------------------------------------------------------------------------------------------------------

    INPUT : {email, password}
    PROCESS : check if the email is already present in the database, if either email not present or password does
                not match , send invalid login else send successful login
    OUTPUT : Message saying successfully login and redirect to user page + usertable
*/
router.post('/',(req,res) =>{
    const sql = `SELECT * FROM rec_db.user WHERE e_mail='${req.body.email}'`;
    console.log(req.body);
    connection.query(sql,(err,result)=>{
        console.log(result[0],req.body.password);
        if(result.length > 0 && (result[0].password === 'null' || result[0].password === req.body.password)){
            res.send(result[0]);
        }
        else{
            res.send(null);
        }
    });
})
module.exports = router;


module.exports = router;