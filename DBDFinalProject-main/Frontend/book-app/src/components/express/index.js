const express = require('express');
const cors = require('cors');

const bodyParser =require('body-parser');

// const connection = require('./database');


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/signup',(req,res) =>{    
    console.log(req.body);
    // const sql = `Insert into mydb.user (f_name,l_name,e_mail,user_image,password) values ('${req.body.firstName}','${req.body.lastName}','${req.body.email}','${req.body.image}','${req.body.password}')`;
    // connection.query(sql,(err,result)=>{
    //     if(err){
    //         res.send("User Already exists");
    //     }
    //     else{
    //         res.send("Successfully registered. Please Login");
    //     }
    // })
    
});

app.post('/login',(req,res) =>{
    const sql = `SELECT * FROM mydb.user WHERE e_mail='${req.body.email}'`;
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

app.listen(3002,() =>{
    console.log("Server started on port 3002");
});

