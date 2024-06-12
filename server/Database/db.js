const mongoose=require("mongoose");
const url=process.env.MONGODB_URI;

const connect=()=>{
    mongoose.connect(url).then((db)=>{
        console.log("mongodb is connected properly")
    },(err)=>{
        console.log(err)
    })
}

module.exports=connect