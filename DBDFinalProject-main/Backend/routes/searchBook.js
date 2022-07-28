const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('../database');

const router =express.Router();
router.use(bodyParser.json());
router.use(cors());


/*
    --------------------------------------------------------------------------------------------------
                                SEARCH BOOKS
    --------------------------------------------------------------------------------------------------

    INPUT :     book name (may not be exactly as in database)(filter details if exists else none)
    PROCESS:    select all the books that resembles the regex given by the input
    OUTPUT :    return a list where each element is a json containing {averageRating,bookname,bookcover,authorname}
*/
router.post('/',(req,res) =>{    

    
    // ALL NULL CASE
    if((req.body.bookName == null || req.body.bookName=="")&& (req.body.authorName == null || req.body.authorName=="")&& (req.body.categories == null || req.body.categories.length === 0 ) && req.body.filterRating == null)
    {
        sql_query = `CREATE OR REPLACE VIEW temp AS SELECT * FROM Book INNER JOIN Book_WrittenBy_Author WHERE Book.book_id = Book_WrittenBy_Author.Book_book_id; SELECT book_id, book_name, author_id, author_name, thumbnail, AverageRating FROM Author INNER JOIN temp WHERE Author.author_id = temp.Author_author_id;`;

        connection.query(sql_query,(err,result1) =>{
            if(err) {console.log(err)}
            else{
                res.send(result1[1]);
            }
        })
        return;
    }

    // BOOK NAME NOT NULL
    
    if(req.body.bookName != '' && req.body.bookName!=null){
        sql_for_bookName = `CREATE OR REPLACE VIEW temp AS SELECT * FROM Author INNER JOIN Book_WrittenBy_Author WHERE Author.author_id = Book_WrittenBy_Author.Author_author_id;
        CREATE OR REPLACE VIEW temp2 AS SELECT book_id, book_name, author_id, author_name, thumbnail, AverageRating FROM Book INNER JOIN temp WHERE Book.book_id = temp.Book_book_id;
        SELECT * FROM temp2 WHERE book_name LIKE '%${req.body.bookName}%';`
        console.log(req.body);
        connection.query(sql_for_bookName,(err,result2)=>{
            if(err){console.log(err)}
            else{
                console.log("result2 = ", result2[2]);
                res.send(result2[2]);
            }
        })
        return;
    }

    // author name with not null value
    if(req.body.authorName != '' && req.body.authorName!=null){
        console.log(req.body);
        //sql_for_authorName=`CREATE OR REPLACE VIEW temp AS SELECT * FROM Author INNER JOIN Book_WrittenBy_Author WHERE Author.author_id = Book_WrittenBy_Author.Author_author_id; CREATE OR REPLACE VIEW temp2 AS SELECT book_id, book_name, author_id, author_name, thumbnail, AverageRating FROM Book INNER JOIN temp WHERE Book.book_id = temp.Book_book_id; SELECT * FROM temp2 WHERE author_name LIKE '%${req.body.authorName}%'`;
        sql_for_authorName = `Select b.book_id, b.book_name, b.thumbnail, b.AverageRating, a1.author_id, a1.author_name from author a1, book_writtenby_author a2, book b where a1.author_id = a2.author_author_id and a2.book_book_id = b.book_id and a1.author_name Like '%${req.body.authorName}%';`
        connection.query(sql_for_authorName,(err,result3)=>{
            if(err){console.log(err)}
            else{
                // console.log("Hello\n");
                // Object.keys(result3).forEach(key =>
                //     {
                //         console.log(key,result3[key]);
                //     }
                // ) 
                console.log("result = "+result3);
                res.send(result3);
            }
        })
        return;
    }
    
    // Categories with not null value
    if(req.body.categories.length!==0){
        let query=""
        console.log(req.body);
        for(let i=0;i<req.body.categories.length;i++){
            if(i==0){
                query=query+`genre_name LIKE '%${req.body.categories[i]}%'`;
            }
            else{
                query=query+`OR genre_name LIKE '%${req.body.categories[i]}%'`;
            }
        }
        console.log(query)
        sql_for_genreName=`CREATE OR REPLACE VIEW temp AS SELECT * FROM Author INNER JOIN Book_WrittenBy_Author WHERE Author.author_id = Book_WrittenBy_Author.Author_author_id;CREATE OR REPLACE VIEW temp2 AS SELECT book_id, book_name, author_id, author_name, thumbnail, AverageRating FROM Book INNER JOIN temp WHERE Book.book_id = temp.Book_book_id;CREATE OR REPLACE VIEW temp3 AS SELECT * FROM temp2 INNER JOIN Book_belongsTo_Genre WHERE temp2.book_id = Book_belongsTo_Genre.Book_book_id;CREATE OR REPLACE VIEW temp4 AS SELECT * FROM temp3 INNER JOIN Genre WHERE temp3.Genre_genre_id = Genre.genre_id;SELECT book_id, book_name, author_id, author_name, thumbnail, AverageRating FROM temp4 WHERE `+query;
        connection.query(sql_for_genreName,(err,result4)=>{
            if(err){console.log(err)}
            else{
                console.log("result"+result4[4]);
                res.send(result4[4]);
            }
        })
        return;
    }
});
module.exports = router;