require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});



const User = mongoose.model('User',userSchema);


app.listen(3000,()=>{console.log("server started successfully on port 3000")});

app.get("/",(req,res)=>{
  res.render("home");
});

app.get("/login",(req,res)=>{
  res.render("login");
});

app.post("/login",(req,res)=>{
  const username= req.body.username;
  const password= md5(req.body.password);

  User.findOne({email: username},(err,userAccount)=>{
    if(err){console.log(err)}
    else{
      if(username){
        if(userAccount.password===password){
          res.render("secrets")
        }
      }
    }
  })

});

app.get("/register",(req,res)=>{
  res.render("register");
});

app.post("/Registered",(req,res)=>{
  res.redirect("login");
});

app.post("/register",(req,res)=>{
  const username= req.body.username;
  const password= md5(req.body.password);

const newUser = new User({
  email: username,
  password: password
});
User.findOne({email: username},(err,userAccount)=>{

    newUser.save((err)=>{
      if(err){console.log(err)}
      else{
        res.render("secrets")
      }
    })
  })
});
