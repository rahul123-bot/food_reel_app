const mongoose=require('mongoose');

function connectDB(){
    mongoose.connect(process.env.MONGODB_URL)
      .then(()=>{
        console.log("mongoDB connected");
      })
      .catch((error)=>{
         console.log(("mongoDB connection error",error));
      })
}
module.exports= connectDB;