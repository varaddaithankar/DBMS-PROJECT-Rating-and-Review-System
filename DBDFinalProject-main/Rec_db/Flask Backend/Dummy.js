const request = require('request-promise');


const f = async () =>{
var data = { // this variable contains the data you want to send 
    userid:'1',
    bookids:['1','2','3']
} 

var options = { 
    method: 'POST', 
    uri: 'http://127.0.0.1:5000/', 
    body: data, 
    json: true // Automatically stringifies the body to JSON 
}; 
var sendrequest = await request(options) 
    .then(function (parsedBody) { 
        console.log(parsedBody); // parsedBody contains the data sent back from the Flask server 
    }) 
    .catch(function (err) { 
        console.log(err); 
    }); 
}

f();