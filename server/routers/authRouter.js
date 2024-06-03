const express = require("express");
const router = express.Router();
const users=require('../Schema/userSchema')
const bcrypt=require('bcryptjs');
const jwt=require("jsonwebtoken");
const protect=require('../middleware/authMiddleware');

const generateJwt=(id)=>{
    return jwt.sign({id},process.env.SECRET_KEY,{expiresIn:"30d"});
}

router.get('/user',protect,async(req,res)=>{
    const user=await users.findOne({_id:req.user._id})
    res.status(200).json({
      _id:user._id,
      username:user.username,
      loggedIn:true,
      token:generateJwt(user._id)
    })
})

router.post("/login", async(req, res) => {

  const isUserPresent=await users.findOne({username:req.body.vals.username})
  if(!isUserPresent){
    res.status(400).send("user not found")
  }else{
    const isPasswordCorrect=await bcrypt.compare(req.body.vals.password,isUserPresent.password)

    if(isPasswordCorrect){
      res.status(200).send({
        _id:isUserPresent._id,
        username:isUserPresent.username,
        loggedIn:true,
        token:generateJwt(isUserPresent._id)
      })
    }else{
      res.status(400).send("password is incorrect")
    }
  }
});

router.post("/signup", async(req, res) => {

  const userExisting=await users.findOne({username:req.body.vals.username})

  if(userExisting){
    res.status(400).send("user already exists")
  }else{

    const salt=await bcrypt.genSalt(10);
    const hashPass=await bcrypt.hash(req.body.vals.password,salt);

    const user=await users.create({
      username:req.body.vals.username,
      password:hashPass
    })
    
    res.status(201).json({
      _id:user._id,
      username:user.username,
      password:user.password,
      token:generateJwt(user._id)
    })
  }
});
module.exports = router;