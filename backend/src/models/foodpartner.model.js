const mongoose = require('mongoose');
const foodPartnerSchema = new mongoose.Schema({
    businessName:{
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },    
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },  
    password:{
        type: String,
        required: true
    }
})
const foodPartnerModel= mongoose.model("foodpartner",foodPartnerSchema);
module.exports= foodPartnerModel;
