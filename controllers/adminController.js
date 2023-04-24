const User = require("../models/userModel");
const Article = require('../models/article');
const Article1 = require('../models/company');
const Resource = require('../models/resource');
const Resource1 = require('../models/coreResource');
const  bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const config = require("../config/config");
const nodemailer = require("nodemailer");


const securePassword = async(password)=>{
    try{

        const passwordHash = await bcrypt.hash(password,10);
        return  passwordHash;

    } catch(error){
        console.log(error.message);
    }
}

const sendResetPasswordMail =  async(name, email, token)=>{
    try{

         const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
         });

         const mailOptions = {
            from:config.emailUser,
            to:email,
            subject:'For Reset Password ',
            html:'<p>Hii ' + name + ',please  click here to <a href="http://localhost:3000/admin/forget-password?token='+token+'">Reset  </a> your password .</p>'

         }
         transporter.sendMail(mailOptions, function(error,info){
            if(error){
                console.log(error);
            }
            else{
                 console.log("Email has been sent:- " , info.response);
            }
         })

    }catch(error){
        console.log(error.message);
    }
}

const loadLogin = async(req,res)=>{
    try{
        res.render('Alogin');
    }
    catch(error){
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>
{
    try{
          const email = req.body.email;
          const password = req.body.password;

     const userData = await   User.findOne({email:email});
      if(userData){

        const passwordMatch = await bcrypt.compare(password,userData.password);
           if(passwordMatch){
                   
            if(userData.is_admin === 0){
                res.render('Alogin',{message:"Email and password is incorrect"});

            }  
            else
            {
                req.session.user_id = userData._id;
                res.redirect("/admin/Ahome");
            }

           }
           else
           {
            res.render('Alogin',{message:"Email and password is incorect"});
    

           }


      }
      else{
        res.render('Alogin',{message:"Email and password is incorect"});
      }
    }
    catch(error)
    {
     console.log(error.message);
    }
}

 const loadDashboard = async (req,res)=>{
     try {
        res.render('Ahome');
    }
    catch(error){
        console.log(error.message);
    }
 }

 const logout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/');
    }
    catch(error){
        console.log(error.message);
    }
 }

 const forgetLoad = async(req,res)=>{
    try{
        res.render('Aforget');
    }
    catch(error){
        console.log(error.message);
    }
 }

 const forgetVerify = async(req,res)=>
 {
    try{
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if(userData){
            if(userData.is_admin === 0){
                res.render('Aforget',{message:'Email is incorrect'});
            }
            else
            {
                
               const randomString = randomstring.generate();
               const updatedData = await  User.updateOne({email:email},{$set:{token:randomString}});
               sendResetPasswordMail(userData.name,userData.email,randomString);
               res.render('Aforget',{message:'Please check your mail to reset yout password'});
            }

        }
        else{
            res.render('Aforget',{message:'Email is incorrect'});
        }
    }
    catch(error){
        console.log(error.message);
    }
 }

 const forgetPasswordLoad =  async(req,res)=>{
    try{
        const token = req.query.token;

      const tokenData = await   User.findOne({token:token});
      if(tokenData){
        res.render('forget-password',{user_id:tokenData._id});

      }
      else{
        res.render('404',{message:"Invalid Link"});
      }
    }
    catch(error){
console.log(error.message);
    }
 }

 const resetPassword = async(req,res)=>
 {
    try{
const password = req.body.password;
const user_id = req.body.user_id;
const securePass = await  securePassword(password);
const updatedData = await User.findByIdAndUpdate({_id:user_id},{ $set:{password:securePass}});
    
   res.redirect('/admin');
}
    catch(error){
        console.log(error.message);
    }
 }



// //user experience
const  Exp = async(req,res)=>
{
    try{
        const article=await Article.find();
        res.render('Aexperience',{article:article})
    }catch (error){
        console.log(error.message);
    }
}
const  SlugExp = async(req,res)=>
{
    const article=await Article.findOne({slug:req.params.slug})
    if(article==null){res.redirect('/admin/Aexperience')}
    res.render('showExp',{article:article})
}
const  DelExp = async(req,res)=>
{
    var id=req.params.id;
    Article.findByIdAndRemove(id).exec();
    res.redirect('/admin/Aexperience');
}

//company
const  Com = async(req,res)=>
{
    try{
        const article=await Article1.find();
        res.render('Acompanydetails',{article:article})
    }catch (error){
        console.log(error.message);
    }
}
const  Del= async(req,res)=>
{
    try{
        var id=req.params.id;
    Article1.findByIdAndRemove(id).exec();
    res.redirect('/admin/Acompanydetails');
    }catch (error){
        console.log(error.message);
    }
}
//resources
const  ResLoad = async(req,res)=>
{
    try{
        
        res.render('AresourcesLandingPage')
    }catch (error){
        console.log(error.message);
    }
}
const  dsaRes = async(req,res)=>
{
    try{
        const dsaRes=await Resource.find();
        res.render('AdsaRes',{dsaRes:dsaRes})
    }catch (error){
        console.log(error.message);
    }
}
const  DelDsaRes = async(req,res)=>
{
    try {
          var id=req.params.id;
    Resource.findByIdAndRemove(id).exec();
    res.redirect('/admin/AdsaRes');
    }catch (error){
        console.log(error.message);
    }
}
const  coreRes = async(req,res)=>
{
    try{
        const dsaRes=await Resource1.find();
        res.render('AcoreRes',{dsaRes:dsaRes})
    }catch (error){
        console.log(error.message);
    }
}
const  DelCoreRes = async(req,res)=>
{
    try {
          var id=req.params.id;
    Resource1.findByIdAndRemove(id).exec();
    res.redirect('/admin/AcoreRes');
    }catch (error){
        console.log(error.message);
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    SlugExp,
    Exp,
    DelExp,
    Com,
    Del,
    ResLoad,
    dsaRes,
    DelDsaRes,
    DelCoreRes,
    coreRes

}