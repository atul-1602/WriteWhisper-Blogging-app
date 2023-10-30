const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const UserModel=require("./models/User")
const UserSignupModel=require("./models/Signup")

const app=express();
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/blogInfo");
app.listen(3001, ()=>{
    console.log("server is running on 3001");
})


app.post("/blogs", (req, res)=>{
            UserModel.create(req.body)
            .then(data=>res.json(data))
            .catch(err=> res.json(err))
})
app.post("/signup", (req, res)=>{
    UserSignupModel.create(req.body)
            .then(data=>res.json(data))
            .catch(err=> res.json(err))
})


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserSignupModel.findOne({ email});

        if (user) {
             if (user.password === password) {
                res.json({ success: true });
            } else {
                res.json({ success: false, error: 'Invalid password' });
            }
        }  else {
            // Invalid credentials
            res.json({ success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

  


app.get("/getAllData",async(req,res)=>{
    try{
       const allData= await UserModel.find({});
       res.send({status:"ok", data:allData});
    }catch(err){
        console.log(err);
    }
})