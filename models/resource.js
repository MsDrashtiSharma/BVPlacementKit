const mongoose=require('mongoose');
const slugify=require('slugify');

const articleSchema=new mongoose.Schema({
    restype:{
         type:String,
         required:true
    },
    resowner:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    info:{
        type:String,
        required:true
    },
   slug:{
    type:String,
    required:true,
    unique:true
   }
})

articleSchema.pre('validate',function(next)
{
    if(this.subject){
        this.slug=slugify(this.subject,{lower:true,strict:true})
    }
    next()
})
module.exports=mongoose.model("res",articleSchema)
