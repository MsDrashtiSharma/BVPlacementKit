const mongoose=require('mongoose');
const slugify=require('slugify');

const articleSchema=new mongoose.Schema({
    copname:{
         type:String,
         required:true
    },
    emailid:{
        type:String,
        required:true
    },
    pos:{
        type:String,
        required:true
    },
    sdname:{
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
    if(this.sdname){
        this.slug=slugify(this.sdname,{lower:true,strict:true})
    }
    next()
})
module.exports=mongoose.model("exper",articleSchema)
