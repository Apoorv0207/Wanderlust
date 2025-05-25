const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        reqired:true
    }
});

userSchema.plugin(passportLocalMongoose);//it creates automatically username and hashing and salting for password

module.exports=mongoose.model('User',userSchema);