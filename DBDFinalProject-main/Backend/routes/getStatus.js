const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('../database');
const nosql = require('../nosql');
//const nosql = require('../nosql');
const router = express.Router();
router.use(bodyParser.json());
router.use(cors());

router.post('/',(req,res)=>{
    sql_query=`SELECT user_id FROM user WHERE e_mail='${req.body.e_mail}'`;
        connection.query(sql_query,(err,result5)=>{
            console.log(result5);
            x=result5[0]['user_id'];
            sql_query2 = `Select status from book_readingstatus_user where book_book_id = '${req.body.bookId}' and user_user_id = ${x}`;
            connection.query(sql_query2, (err,result6) => {
                console.log("result6 = ", result6);
                if(result6.length > 0)
                    res.send(result6[0]['status']);
                else
                    res.send("Set Status");
            });
        });

});
module.exports = router;
