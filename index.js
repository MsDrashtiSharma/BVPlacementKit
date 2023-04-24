const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://aanchalsingh:project1@cluster0.0zfwppl.mongodb.net/StudentDB");

const express = require("express");
const app= express();
// //body parser
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// //public folder
app.use(express.static("public"));
//view engine
app.set('view engine','ejs');

//for user routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);


//for admin routes
const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute);

app.listen(3000,function(){
    console.log("Server is running at 3000!");
});