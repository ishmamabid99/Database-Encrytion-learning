require("dotenv").config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
//const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;



const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//console.log(secret);
//userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:["password"]});

const User = new mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    console.log(hash);
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save((err) => {
      if (!err) res.render("secrets");
    });
  });
});
app.post("/login", (req, res) => {
  User.findOne({
    email: req.body.username
  }, (err, foundItem) => {
    if (err) console.log(err);
    else {
      bcrypt.compare(req.body.password , foundItem.password , (err ,result)=>{
        if(result) res.render("secrets");
      })
    }
  });
});
app.listen(3000, () => {
  console.log("listening to port 3000");
})
