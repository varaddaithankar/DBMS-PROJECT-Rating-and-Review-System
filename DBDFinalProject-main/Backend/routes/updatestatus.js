const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('../database');

const router =express.Router();
router.use(bodyParser.json());
router.use(cors());
/*
    ---------------------------------------------------------------------------------------------------------
                                            UPDATE STATUS
    ---------------------------------------------------------------------------------------------------------
    INPUT : bookid,userid, new status
    PROCESS : update the status of the book in the status table
    OUTPUT : return success message
*/
router.post('/',(req,res) =>{ 
    let x = 0;
    console.log(req.body);   
    sql_query=`SELECT user_id FROM user WHERE e_mail='${req.body.e_mail}'`;
    connection.query(sql_query,(err,result5)=>{
        console.log(result5);
        x=result5[0]['user_id'];
        console.log(x);
        sql_query2=`INSERT INTO Book_readingStatus_User (User_user_id, Book_book_id, status) VALUES (${x}, '${req.body.bookId}', '${req.body.status}') ON DUPLICATE KEY UPDATE status = '${req.body.status}';`
        console.log(sql_query2);
        connection.query(sql_query2,(err,result10)=>{
        console.log(result10);
        if(err){
            console.log(err);
            res.send("");
        }
        else{
            res.send("successful");
        }
    })
    })
})
module.exports = router;