const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('../database');

const router =express.Router();
router.use(bodyParser.json());
router.use(cors());
/*
    --------------------------------------------------------------------------------------------------
                            Rating Book Page
    --------------------------------------------------------------------------------------------------
    INPUT : Bookid, userid,rating, review
    PROCESS : Update the Rating table (or add if (userid,bookid) pair does not exist)
    OUTPUT : return success message

*/
router.post('/',(req,res) =>{    
    console.log(req.body);
    answer=[]
    let x =0;
    sql_query=`SELECT user_id FROM user WHERE e_mail='${req.body.e_mail}'`;
    connection.query(sql_query,(err,result5)=>{
        console.log(result5);
        x=result5[0]['user_id'];
        
        if(err){console.log("error"+err)}
        else{
            // res.send(result);

            sql_test=`SELECT * FROM rating WHERE User_user_id='${x}' AND Book_book_id='${req.body.bookId}'` ;
            connection.query(sql_test,(err,result7)=>{
                console.log("result7"+result7);
                if(result7.length == 0){
                    sql_query2=`INSERT INTO rating (Book_book_id,User_user_id,rating_value,ReviewComment) VALUES ('${req.body.bookId}',${x},${req.body.rating},'${req.body.review}')`
                    connection.query(sql_query2,(err,result6)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log(result6)
                            sql_for_avg = `UPDATE Book SET AverageRating = (SELECT AVG(rating_value) FROM Rating WHERE Book_book_id = '${req.body.bookId}') WHERE Book_id = '${req.body.bookId}';`;
                            connection.query(sql_for_avg, (err, result9) => {
                                if(err){
                                    console.log(err);
                                }
                            })
                            res.send(result6);
                        }

                    })
                }
                else {
                    console.log("repeated rating");
                    res.send("");
                }
            });
        }
    })
    

});
module.exports = router;