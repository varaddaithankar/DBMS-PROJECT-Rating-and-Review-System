const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
mongoose.connect(
  `mongodb+srv://mydatabase:pass12345678@cluster0.d07zm.mongodb.net/DBDproject`,
  {
    useNewUrlParser: true,
    //useFindAndModify: false,
    useUnifiedTopology: true
  }
);
const db = mongoose.connection;
//db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const UserSchema = new mongoose.Schema({
    book_id:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
},{collection: 'descrip'});

const User = mongoose.model("descrip", UserSchema);
module.exports= User;
//const user=new User({book_id:1,description:'this is a book'});
//user.save();
// const val = User.find({}).limit(2).then((data) => console.log(data));
// console.log(User.find());
//console.log(test);
