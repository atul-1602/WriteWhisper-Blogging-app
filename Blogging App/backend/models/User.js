const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    name:String,
    about:String,
    email:String,
    keywords:String,
    question:String,
    blog:String,
    blogdate: { type: Date, default: Date.now() }
    
    
})

const UserModel=mongoose.model("users", userSchema);  // schema made with "users" name 
module.exports=UserModel;