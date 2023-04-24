const User = require('../models/userModel');
const Article = require('../models/article');
const Article1 = require('../models/company');
const Resource = require('../models/resource');
const Resource1 = require('../models/coreResource');
const bcrypt = require ('bcrypt');

const nodemailer = require("nodemailer");

const config = require("../config/config");
const randomstring = require("randomstring")


const securePassword = async(password)=>{
    try{

        const passwordHash = await bcrypt.hash(password,10);
        return  passwordHash;

    } catch(error){
        console.log(error.message);
    }
}

//for send mail

const sendVerifyMail =  async(name, email, user_id)=>{
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
            subject:'For Verification mail',
            html:'<p>Hii ' + name + ',please  click here to <a href="http://localhost:3000/verify?id='+user_id+'">Verify  </a> your mail.</p>'

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

//for reset password send mail 

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
            html:'<p>Hii ' + name + ',please  click here to <a href="http://localhost:3000/forget-password?token='+token+'">Reset   </a> your password .</p>'

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


const  loadlanding = async(req,res)=>
{
    try{

        res.render('landing');
    }catch (error){
        console.log(error.message);
    }
}

const loadRegister = async(req,res)=>{

    try{

        res.render('registration');
    }catch (error){
        console.log(error.message);
    }
}

const insertUser = async(req,res)=> {
    try {

         const spassword = await  securePassword(req.body.password);

       const user = new  User({
           name:req.body.name,
           email:req.body.email,
           password:spassword,
           is_admin:0,


       });

     const userData =  await   user.save();

     if(userData){
           
        sendVerifyMail(req.body.name, req.body.email , userData._id);

        res.render('registration' ,{message:"Your registration has been successfully. Please verify your mail ."});
     }
     else{
        res.render('registration' ,{message:"Your registration has been failed"});

     }
    }catch (error){
        console.log(error.message);
    }

    

}




const verifyMail = async(req,res)=>{
    try{
          const updateInfo = await User.updateOne({_id:req.query.id},{ $set:{ is_verified:1 }});
        
          console.log(updateInfo);
          res.render("email-verified");
    }
    catch(error){
        console.log(error.message);
    }
}





//Login user methods started

const loginLoad = async(req,res)=>{
    try{

        res.render('login');

    }catch(error){
        console.log(error.message);
    }
}

 
const verifyLogin = async(req,res)=>
{
    try
        {

          const email = req.body.email;
          const password = req.body.password;

          const userData =  await  User.findOne({email:email});
          if(userData)
          {
            
           const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch)
            {

                    if(userData.is_verified === 0)
                    {
                   res.render('login' , {message:"Please  verify your mail ."});
                    }
                    else
                    {

                        req.session.user_id = userData._id;
                       res.redirect('/home');
                    }
            
            }
            else
            {
            res.render('login',{message:"Email and password is incorrect"});
   
            }
          }
           else
          {
           res.render('login',{message:"Email and password is incorrect"});
          }


        }
        catch(error)
        {
        console.log(error.message);
        }
}

const loadHome = async(req,res)=>{
    try{
        res.render('home');
    }
    catch(error){
        console.log(error.message);
    }
} 

const userlogout = async( req,res)=>
{
    try{
        req.session.destroy();
        res.redirect('/');
    }
    catch(error){
        console.log(error.message);
    }
}

//forget password starts

const forgetLoad = async(req,res)=>
{
    try{
        res.render('forget');
    }
    catch(error){
        console.log(error.message);
    }
}

const forgetVerify = async(req,res)=>{

    try{

        const email = req.body.email;
       const userData =  await User.findOne({email:email});
       if(userData){
        
          if(userData.is_verified === 0){
            res.render('forget',{message:"Please verify your mail"});
        }
        else
        {
            const randomString = randomstring.generate();
            const updatedData  = await User.updateOne({email:email},{$set:{ token:randomString}});
            sendResetPasswordMail(userData.name,userData.email,randomString);
            res.render('forget',{message:"Please Check your mail to reset your password. "});
        }
          
       }
       else
       {
        res.render('forget',{message:"User email is incorrect"});
       }




    }catch(error){
        console.log(error.message);
    }

}


const forgetPasswordLoad = async (req,res)=>{
    try{
  
        const token = req.query.token;
        const tokenData = await User.findOne({token:token});
        if(tokenData){
            res.render('forget-password',{user_id:tokenData._id});
        }
else 
{
    res.render('404',{message:"Token is invalid."});
}

    }
    catch(error){
        console.log(error.message);
    }

}

const resetPassword = async (req,res)=>{
    try{
        const password = req.body.password;
        const user_id = req.body.user_id;
        const secure_password = await securePassword(password);
   
       const updatedData = await User.findByIdAndUpdate({_id:user_id},{ $set:{password:secure_password , token:''}});
   res.redirect("/");
   
    }
    catch(error)
    {
        console.log(error.message);
    }
}


const  topDsa = async(req,res)=>
{
    try{

        res.render('topDsaQues');
    }catch (error){
        console.log(error.message);
    }
}

const  loadDBMS  = async(req,res)=>
{
    try{

        res.render('dbms');
    }catch (error){
        console.log(error.message);
    }
}

const  loadDCN = async(req,res)=>
{
    try{

        res.render('dcn');
    }catch (error){
        console.log(error.message);
    }
}
const  loadOS = async(req,res)=>
{
    try{

        res.render('os');
    }catch (error){
        console.log(error.message);
    }
}
const  loadOOPS = async(req,res)=>
{
    try{

        res.render('oops');
    }catch (error){
        console.log(error.message);
    }
}



// //user experience
const  Exp = async(req,res)=>
{
    try{
        const article=await Article.find();
        res.render('experience',{article:article})
    }catch (error){
        console.log(error.message);
    }
}
const  NewExp = (req,res)=>
{
    try{

        res.render('newExp');
    }catch (error){
        console.log(error.message);
    }
}

const  SlugExp = async(req,res)=>
{
    try{
    const article=await Article.findOne({slug:req.params.slug})
    if(article==null){res.redirect('/experience')}
    res.render('showExp',{article:article});
    }catch(error){
        console.log(error.message);
    }
}
const  SaveExp = (req,res)=>
{
    const article=new Article({
        copname:req.body.copname,
        emailid:req.body.emailid,
        pos:req.body.pos,
        sdname:req.body.sdname,
        info:req.body.info
     })   
    
    article.save().then(()=>{
        res.redirect('/experience');
        
    })
}
//user company
const  Com = async(req,res)=>
{
    try{
        const article=await Article1.find();
        res.render('companydetails',{article:article});
    }catch (error){
        console.log(error.message);
    }
}
const  NewCom = (req,res)=>
{
    try{

        res.render('newcompany');
    }catch (error){
        console.log(error.message);
    }
}


const  SaveCom = (req,res)=>
{
    const article=new Article1({
        cpname:req.body.cpname,
        infor:req.body.infor,
        time:req.body.time,
        eligiblity:req.body.eligiblity,
        role:req.body.role
     })   
    
    article.save().then(()=>{
        res.redirect('/companydetails');
        
    })
}
//Resources
const  ResLoad = async(req,res)=>
{
    try{
        res.render('resourcesLandingPage')
    }catch (error){
        console.log(error.message);
    }
}
const  dsaRes = async(req,res)=>
{
    try{
        const dsaRes=await Resource.find();
        res.render('dsaRes',{dsaRes:dsaRes})
    }catch (error){
        console.log(error.message);
    }
}
const  NewDsaRes = (req,res)=>
{
    try{
        res.render('newDsaRes')
    }catch (error){
        console.log(error.message);
    }
}


const  SaveDsaRes = (req,res)=>
{
    const dsaRes=new Resource({
        restype:req.body.restype,
        resowner:req.body.resowner,
        info:req.body.info,
        subject:req.body.subject 
        
     })   
    
    dsaRes.save().then(()=>{
        res.redirect('/dsaRes')
        
    })
}
const  ProRes = async(req,res)=>
{
    try{
        
        res.render('projectResources')
    }catch (error){
        console.log(error.message);
    }
}
const  ResumeRes = async(req,res)=>
{
    try{
        
        res.render('resumeResources')
    }catch (error){
        console.log(error.message);
    }
}
const  coreRes = async(req,res)=>
{
    try{
        const dsaRes=await Resource1.find();
        res.render('coreRes',{dsaRes:dsaRes})
    }catch (error){
        console.log(error.message);
    }
}
const  NewCoreRes = (req,res)=>
{
    try{

        res.render('newCore')
    }catch (error){
        console.log(error.message);
    }
}


const  SaveCoreRes = (req,res)=>
{
    const dsaRes=new Resource1({
        restype:req.body.restype,
        resowner:req.body.resowner,
        info:req.body.info,
        subject:req.body.subject 
        
     })   
    
    dsaRes.save().then(()=>{
        res.redirect('/coreRes')
        
    })
}

module.exports = {
    loadlanding,
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userlogout,
    forgetLoad, 
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    topDsa,
    loadOOPS,
    loadOS,
    loadDCN,
     loadDBMS,
    NewExp,
    SlugExp,
    Exp,
    SaveExp,
    Com,
    NewCom,
    SaveCom,
    ResLoad,
    dsaRes,
    NewDsaRes,
    SaveDsaRes,
    ProRes,
    ResumeRes,
    coreRes,
    NewCoreRes,
    SaveCoreRes

}