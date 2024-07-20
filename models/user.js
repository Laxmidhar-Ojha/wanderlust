const mongoose =require("mongoose");
const Schema= mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:string,
        required:true,
    },
});
user.plugin(passportLocalMongoose);

module.exports=mongoose.model("user",userSchema);