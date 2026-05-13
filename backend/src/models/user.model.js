const mongoose= require('mongoose');
 

const userSchema= new mongoose.Schema({
    username:{
        type: String,
        unique: true
    },
    fullname:{
        type: String,
        require: true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    phone:{
        type: String,
        require: true
    },
    address:{
        type: String,
        require: true
    },       
    password:{
        type:String,
    }
},
    {
        timestamps:true
    } 
)

const userModel=mongoose.model("user",userSchema);
module.exports= userModel;
