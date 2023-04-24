const mongoose=require('mongoose');
const slugify=require('slugify');

const companyDetailSchema=new mongoose.Schema({
    cpname:{
         type:String,
         required:true
    },
    infor:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
   },
   eligiblity:{
    type:String,
    required:true
   },
   role:{
    type:String,
    required:true
   },
   slug:{
    type:String,
    required:true,
    unique:true
   }
})
companyDetailSchema.pre('validate',function(next)
{
    if(this.cpname){
        this.slug=slugify(this.cpname,{lower:true,strict:true})
    }
    next()
})
module.exports=mongoose.model("companyDetails",companyDetailSchema)
