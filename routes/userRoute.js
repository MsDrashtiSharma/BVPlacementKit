const express = require("express");
const user_route =  express();
const session = require("express-session");

const config = require("../config/config");
user_route.use(session({secret:config.sessionSecret}));

const auth= require("../middleware/auth");
  //body parsers

user_route.use(express.json());
user_route.use(express.urlencoded({extended:false}));
//public
user_route.use(express.static('public'))
//view engine

user_route.set('view engine','ejs');
user_route.set('views', './views/users');


const userController = require("../controllers/userController");




user_route.get('/',userController.loadlanding);


user_route.get('/registration',auth.isLogout,userController.loadRegister);

user_route.post('/registration',userController.insertUser);

user_route.get('/verify',userController.verifyMail);

user_route.get('/login',auth.isLogout,userController.loginLoad);

user_route.post('/login',userController.verifyLogin);
user_route.get ('/home',auth.isLogin,userController.loadHome);

user_route.get('/logout',auth.isLogin,userController.userlogout);
user_route.get('/forget',auth.isLogout,userController.forgetLoad);

user_route.post('/forget',userController.forgetVerify);

user_route.get('/forget-password',auth.isLogout,userController.forgetPasswordLoad);

user_route.post('/forget-password',userController.resetPassword);
user_route.get('/topDsaQues',userController.topDsa);

user_route.get('/dbms',userController.loadDBMS);
user_route.get('/oops',userController.loadOOPS);
user_route.get('/dcn',userController.loadDCN);
user_route.get('/os',userController.loadOS);
//user exp 
user_route.get('/experience',userController.Exp);
user_route.get('/newExp',userController.NewExp);

user_route.get('/show/:slug',userController.SlugExp);

user_route.post('/experience',userController.SaveExp);
//company details
user_route.get('/companydetails',userController.Com);
user_route.get('/newcompany',userController.NewCom);
user_route.post('/companydetails',userController.SaveCom);
//resources
user_route.get('/resourcesLandingPage',userController.ResLoad);
user_route.get('/dsaRes',userController.dsaRes)
user_route.get('/newDsaRes',userController.NewDsaRes);
user_route.post('/dsaRes',userController.SaveDsaRes);
user_route.get('/projectResources',userController.ProRes);
user_route.get('/resumeResources',userController.ResumeRes);
user_route.get('/coreRes',userController.coreRes);
user_route.get('/newCore',userController.NewCoreRes);
user_route.post('/coreRes',userController.SaveCoreRes);


module.exports = user_route;