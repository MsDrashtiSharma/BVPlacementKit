const express = require("express");
const admin_route = express();
const session = require("express-session");
const config =  require("../config/config");
admin_route.use(session({secret:config.sessionSecret}));

//vody-parser
const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

//public 
admin_route.use(express.static('public'))
//view engine

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

const auth = require("../middleware/adminAuth"); 
  
const adminController = require("../controllers/adminController");

admin_route.get('/Alogin',auth.isLogout,adminController.loadLogin);

admin_route.post('/Alogin',adminController.verifyLogin);

admin_route.get('/Ahome',auth.isLogin,adminController.loadDashboard);

admin_route.get('/logout',auth.isLogin,adminController.logout); 

admin_route.get('/Aforget',auth.isLogout,adminController.forgetLoad); 

admin_route.post('/Aforget',adminController.forgetVerify); 

admin_route.get('/forget-password',auth.isLogout,adminController.forgetPasswordLoad); 

admin_route.post('/forget-password',adminController.resetPassword); 
//exp
admin_route.get('/Aexperience',adminController.Exp);
admin_route.get('/exp/delete/:id',adminController.DelExp);
admin_route.get('/show/:slug',adminController.SlugExp);
//company
admin_route.get('/Acompanydetails',adminController.Com);
admin_route.get('/delete/:id',adminController.Del);
//resources
admin_route.get('/AresourcesLandingPage',adminController.ResLoad);
admin_route.get('/AdsaRes',adminController.dsaRes)
admin_route.get('/dsaRes/delete/:id',adminController.DelDsaRes);
admin_route.get('/AcoreRes',adminController.coreRes);
admin_route.get('/coreRes/delete/:id',adminController.DelCoreRes)
// admin_route.get('*',function(req,res){
//     res.redirect('/admin/Alogin');
// });


module.exports = admin_route;