const userModel=require('../models/user.model');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');
const foodPartnerModel = require('../models/foodpartner.model');
const { getTokenFromRequest } = require('../middleware/auth.middleware');
const JWT_SECRET = process.env.JWT_SECRET || 'quickbite-fallback-secret';

async function registerUser(req,res){
    try {
        const { fullname,email,phone,address,password,name }=req.body;
        const displayName = (fullname || name || '').trim();
        const normalizedEmail = (email || '').trim().toLowerCase();

        if (!displayName || !normalizedEmail || !phone || !address || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const hashedPassword= await bcrypt.hash(password, 10);

        const user=await userModel.create({
            username: normalizedEmail,
            fullname: displayName,
            email: normalizedEmail,
            phone,
            address,
            password:hashedPassword
        })
        const token= jwt.sign({
            id: user._id,
            role:"user"
        }, JWT_SECRET)
        const cookieOptions = {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        };
        res.cookie("userToken", token, cookieOptions)
        console.log(`Set cookie userToken for user ${user._id}`);
        res.clearCookie("foodPartnerToken")
        res.clearCookie("token")

        res.status(201).json({
            "message":"user register successfully",
            token,
            user:{
                _id: user._id, 
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        })
    } catch (error) {
        console.error('registerUser error:', error);
        if (error && error.code === 11000) {
            return res.status(400).json({ message: 'user already exist' });
        }
        return res.status(500).json({
            message: 'failed to register user',
            error: error && error.message ? error.message : String(error)
        });
    }
}
async function loginUser(req,res){
    try {
        const {email,password}= req.body;
        const normalizedEmail = (email || '').trim().toLowerCase();
        if (!normalizedEmail || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await userModel.findOne({
            email: normalizedEmail
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
        },JWT_SECRET);
        const cookieOptions = {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        };

        res.cookie("userToken", token, cookieOptions);
        console.log(`Set cookie userToken for user ${user._id}`);
        res.clearCookie("foodPartnerToken")
        res.clearCookie("token")

        res.status(200).json({
            "message":"user logged in successfully",
            token,
            user:{
                _id:user._id,
                email: user.email,
                fullname: user.fullname
            }
        })
    } catch (error) {
        console.error('loginUser error:', error);
        return res.status(500).json({
            message: 'failed to login user',
            error: error && error.message ? error.message : String(error)
        });
    }
    
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

  const token = getTokenFromRequest(req, req.authUser.role);
  res.json({ user: req.authUser, token });
}
async function registerFoodPartner(req,res){
    try {
        const {businessName,email,password,phone,contactName,address}= req.body;
        const normalizedEmail = (email || '').trim().toLowerCase();
        if (!businessName || !normalizedEmail || !password || !phone || !contactName || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const hashedPassword= await bcrypt.hash(password,10);

        const foodpartner =await foodPartnerModel.create({
            businessName,
            email: normalizedEmail,
            password:hashedPassword,
            phone,
            contactName,
            address
        })

        const token= jwt.sign({
            id:foodpartner._id,
            role:"foodPartner"
        },JWT_SECRET)
        const cookieOptions = {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        };
        res.cookie("foodPartnerToken", token, cookieOptions)
        console.log(`Set cookie foodPartnerToken for partner ${foodpartner._id}`);
        res.clearCookie("userToken")
        res.clearCookie("token")

        res.status(201).json({
            "message":"Food Partner register successfully",
            token,
            _id:foodpartner._id,
            businessName:foodpartner.businessName,
            email:foodpartner.email,
            contactName: foodpartner.contactName,
            phone: foodpartner.phone,
            address: foodpartner.address
        })
    } catch (error) {
        console.error('registerFoodPartner error:', error);
        if (error && error.code === 11000) {
            return res.status(400).json({ message: 'Food partner account already exists' });
        }
        return res.status(500).json({
            message: 'failed to register food partner',
            error: error && error.message ? error.message : String(error)
        });
    }

}
async function loginFoodPartner(req,res){
    try {
        const {email,password} = req.body ;
        const normalizedEmail = (email || '').trim().toLowerCase();
        if (!normalizedEmail || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const foodPartner = await foodPartnerModel.findOne({
            email: normalizedEmail
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
        },JWT_SECRET);
        const cookieOptions = {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        };

        res.cookie("foodPartnerToken", token, cookieOptions);
        console.log(`Set cookie foodPartnerToken for partner ${foodPartner._id}`);
        res.clearCookie("userToken")
        res.clearCookie("token");
        

        res.status(200).json({
            "message":"food  logged in successfully",
            token,
            foodPartner :{
                    _id:foodPartner._id,
                    email:foodPartner.email,
                    name:foodPartner.name
            }
        })
    } catch (error) {
        console.error('loginFoodPartner error:', error);
        return res.status(500).json({
            message: 'failed to login food partner',
            error: error && error.message ? error.message : String(error)
        });
    }
    
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
