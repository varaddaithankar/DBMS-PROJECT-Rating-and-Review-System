const express = require('express');
const request = require('request-promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('../database');
const router =express.Router();
router.use(bodyParser.json());
router.use(cors());
/*
    -----------------------------------------------------------------------------------------------------------
                                    FETCH BOOK BY STATUS                            
    -----------------------------------------------------------------------------------------------------------
    INPUT : status class name and userid
    PROCESS : Find all the books belong to the particular status of that particular user and return those book 
                details
    OUTPUT : return a list where each element is a json containing {bookid,bookname,bookcover,authorname}
*/


router.post('/',async (req,res) =>{
    console.log(req.body);   
    if(req.body.bookStatus == 'Recommendations'){
        sql_query=`SELECT user_id FROM user WHERE e_mail='${req.body.e_mail}'`;
        connection.query(sql_query, async (err,result5)=>{
            console.log(result5);
            x=result5[0]['user_id'];
            console.log(x);
            sql_query2 = `SELECT b.book_name FROM Rating r, Book b WHERE r.User_user_id = ${x} AND r.Book_book_id = b.book_id ORDER BY rating_value desc LIMIT 3;`
            console.log(sql_query2)
            connection.query(sql_query2, async (err,result6)=>{
                console.log("Top 3 books: ", result6);
                let b = [];
                for(let i=0;i<Object.keys(result6).length;i++)
                {
                    b.push(result6[i]['book_name'])
                }
                console.log("Top 3 books: ", b);   
                const data = {
                    b,
                    books : []
                } 
                var options = { 
                    method: 'POST', 
                    uri: 'http://127.0.0.1:5000/', 
                    body: data, 
                    json: true // Automatically stringifies the body to JSON 
                }; 
                await request(options) 
                    .then(function (parsedBody) { 
                        console.log(parsedBody['books'])
                        l=[]
                        x = '0'
                        for (const [key, value] of Object.entries(parsedBody['books'])) {
                            obj = {}
                            obj["book_id"] = x;
                            x += 1;
                            obj["book_name"] = key
                            obj["thumbnail"] = value[1]
                            obj["author_name"] = value[0]
                            obj["AverageRating"] = 'N/A'
                            l.push(obj);
                        }
                        console.log(l);
                        res.send([l]);
                    }) 
                    .catch(function (err) { 
                        console.log(err); 
                    });
            })
            })
              
             
    }
    else{
        sql_query=`SELECT user_id FROM user WHERE e_mail='${req.body.e_mail}'`;
        connection.query(sql_query,(err,result5)=>{
            console.log(result5);
            x=result5[0]['user_id'];
            console.log(x);
            //sql_query2=`CREATE OR REPLACE VIEW temp AS SELECT * FROM Book_readingStatus_User WHERE User_user_id = ${x} AND status = '${req.body.bookStatus}';CREATE OR REPLACE VIEW temp2 AS SELECT User_user_id, status, book_id, book_name, thumbnail, AverageRating FROM temp INNER JOIN Book WHERE temp.Book_book_id = Book.book_id;CREATE OR REPLACE VIEW temp3 AS SELECT * FROM temp2 INNER JOIN Book_WrittenBy_Author WHERE temp2.book_id = Book_WrittenBy_Author.Book_book_id;CREATE OR REPLACE VIEW temp4 AS SELECT book_id, book_name, thumbnail, AverageRating, author_name FROM temp3 INNER JOIN Author WHERE temp3.Author_author_id = Author.author_id;SELECT * FROM temp4;`
            sql_query2 = `Select b.book_id, b.book_name, b.thumbnail, b.AverageRating, a1.author_name from book b, author a1, Book_WrittenBy_Author a2 where a1.author_id = a2.author_author_id and a2.book_book_id = b.book_id and exists(Select * from book_readingstatus_user b2 where b2.user_user_id = ${x} and b2.book_book_id = b.book_id and b2.status = '${req.body.bookStatus}');`

            console.log(sql_query2);

            /*
                lob[res.data[0][i]['book_id']] = {
                            "authorName": res.data[0][i]['author_name'],
                            "bookName": res.data[0][i]['book_name'],
                            "cover": res.data[0][i]['thumbnail'],
                            "avg_rating": res.data[0][i]['AverageRating']
                }
            */
            connection.query(sql_query2,(err,result10)=>{
            console.log(result10);
            if(err){
                console.log(err);
                res.send(null);
            }
            else{
                //sql_query3 = `CREATE OR REPLACE VIEW temp AS SELECT * FROM Book INNER JOIN Book_WrittenBy_Author WHERE Book.book_id = Book_WrittenBy_Author.Book_book_id;CREATE OR REPLACE VIEW temp2 AS SELECT * FROM temp INNER JOIN Author WHERE temp.Author_author_id = Author.author_id;SELECT book_id, book_name, thumbnail, AverageRating, author_name FROM temp2 ;`
                console.log("result10[4] = ", result10);
                res.send([result10]);
            }
        })
        })  
    }
});
module.exports = router;