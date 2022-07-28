const mysql = require('mysql2');

const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "password",
    database :"rec_db",
    multipleStatements: true
});


module.exports=connection;