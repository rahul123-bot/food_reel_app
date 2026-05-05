const userModel=require('../models/user.model');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');
const foodPartnerModel = require('../models/foodpartner.model');

async function registerUser(req,res){
    const { fullname,email,phone,address,password}=req.body;

    const isUserAlreadyExist= await userModel.findOne({
        email
    })
    if(isUserAlreadyExist){
        return res.status(400).json({ 
            "message":"user already exist"
        })
    }
    const hashedPassword= await bcrypt.hash(password, 10);

    const user=await userModel.create({
        fullname,
        email,
        phone,
        address,
        password:hashedPassword
    })
    const token= jwt.sign({
        id: user._id,
        role:"user"
    }, process.env.JWT_SECRET)
    res.cookie("userToken", token)
    res.clearCookie("foodPartnerToken")
    res.clearCookie("token")

    res.status(201).json({
        "message":"user register successfully",
        user:{
            _id: user._id, 
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            address: user.address
        }
    })
}
async function loginUser(req,res){
     const {email,password}= req.body;
      const user = await userModel.findOne({
           email
      })
      if(!user){
        return res.status(400).json({
            "message":" Invalid email and password"
        })
      }
      const isPasswordValid = await bcrypt.compare(password,user.password);

      if(!isPasswordValid){
         return res.status(400).json({
            "message":" Invalid email and password"
        })
      }

    const token= jwt.sign({
        id:user._id,
        role:"user"
    },process.env.JWT_SECRET);
    
    res.cookie("userToken", token);
    res.clearCookie("foodPartnerToken")
    res.clearCookie("token")

    res.status(200).json({
        "message":"user logged in successfully",
        user:{
            _id:user._id,
            email: user.email,
            fullname: user.fullname
        }
    })
    
}
function logoutUser ( req,res){
    res.clearCookie("userToken");
    res.clearCookie("foodPartnerToken");
    res.clearCookie("token");
    res.status(200).json({
        "message":"user logged out successfully"
    })
}

async function getMe(req,res){
     if (!req.authUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json({ user: req.authUser });
}
async function registerFoodPartner(req,res){
    const {businessName,email,password,phone,contactName,address}= req.body;
    const isAccountAlreadyExists = await foodPartnerModel.findOne({
        email
    })
    if(isAccountAlreadyExists){
        return res.status(400).json({
            "messsage":"Food partner account already exists"
        })
    }
    const hashedPassword= await bcrypt.hash(password,10);

    const foodpartner =await foodPartnerModel.create({
        businessName,
        email,
        password:hashedPassword,
        phone,
        contactName,
        address
    })

    const token= jwt.sign({
        id:foodpartner._id,
        role:"foodPartner"
    },process.env.JWT_SECRET)
    res.cookie("foodPartnerToken", token)
    res.clearCookie("userToken")
    res.clearCookie("token")

    res.status(201).json({
        "message":"Food Partner register successfully",
        _id:foodpartner._id,
        businessName:foodpartner.businessName,
        email:foodpartner.email,
        contactName: foodpartner.contactName,
        phone: foodpartner.phone,
        address: foodpartner.address
    })

}
async function loginFoodPartner(req,res){
    const {email,password} = req.body ;
      const foodPartner = await foodPartnerModel.findOne({
           email
      })
      if(!foodPartner){
        return res.status(400).json({
            "message":" Invalid email and password"
        })
      }
      const isPasswordValid = await bcrypt.compare(password,foodPartner.password);

      if(!isPasswordValid){
         return res.status(400).json({
            "message":" Invalid email and password"
        })
      }

    const token= jwt.sign({
        id:foodPartner._id,
        role:"foodPartner"
    },process.env.JWT_SECRET);
    
    res.cookie("foodPartnerToken", token);
    res.clearCookie("userToken")
    res.clearCookie("token");
    

    res.status(200).json({
        "message":"food  logged in successfully",
        foodPartner :{
                _id:foodPartner._id,
                email:foodPartner.email,
                name:foodPartner.name
        }
    })
    
}

function logoutFoodPartner ( req,res){
    res.clearCookie("foodPartnerToken");
    res.clearCookie("userToken");
    res.clearCookie("token");
    res.status(200).json({
        "message":"Food partner logged out successfully"
    })
}

module.exports={
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
} 
