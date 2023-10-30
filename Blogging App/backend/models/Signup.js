const mongoose=require("mongoose")
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
    
    
})

const UserSignupModel=mongoose.model("signup", userSchema);  // schema made with "users" name 
module.exports=UserSignupModel;