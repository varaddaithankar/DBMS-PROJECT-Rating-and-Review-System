const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('../database');

const router =express.Router();
router.use(bodyParser.json());
router.use(cors());

/*
    ---------------------------------------------------------------------------------------------------
                                            UPDATE USER DATA
    ---------------------------------------------------------------------------------------------------
    INPUT : userid,email, new username, new password
    PROCESS : find the entry by userid and update the new username and password
    OUTPUT : return success
*/
router.post('/',(req,res) =>{
    console.log(req.body);
    sql = `UPDATE user SET f_name='${req.body.f_name}',l_name='${req.body.l_name}' WHERE e_mail='${req.body.e_mail}'`
    connection.query(sql,(err,result)=>{
        if(err){
            res.send("");
        }
        else{
            res.send("Successful");
        }
    });
});
module.exports = router;
