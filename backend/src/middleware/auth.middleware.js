const foodPartnerModel=require('../models/foodpartner.model');
const userModel=require('../models/user.model');
const jwt= require('jsonwebtoken');
require ('dotenv').config();

function getTokenFromRequest(req, preferredRole) {
    const { userToken, foodPartnerToken, token } = req.cookies || {};

    if (preferredRole === 'user') {
        return userToken || token;
    }

    if (preferredRole === 'foodPartner') {
        return foodPartnerToken || token;
    }

    return userToken || foodPartnerToken || token;
}


async function authFoodPartnerMiddelware(req,res,next){
     const token = getTokenFromRequest(req, 'foodPartner');

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(decoded.role!== "foodPartner"){
            return res.status(403).json({"messgae":"Access denied (partner only)"})
        }

        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if(!foodPartner){
            return res.status(401).json({ message: "Partner not found" });
        }

        req.foodPartner = foodPartner

        next()

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token"
        })

    }

}

async function authUsermiddelware(req,res,next){
     const token= getTokenFromRequest(req, 'user');
     if(!token){
        return res.status(401).json({
             message:"please login first"
        })
     }
     try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(decoded.role!=="user"){
            return res.status(403).json({"message":"Access denied (user only)"})
        }
        const user=await userModel.findById(decoded.id);
        if(!user){
            return res.status(401).json({"message":"user not found"})
        }
        req.user=user;
        next();


     }catch(error){
        return res.status(401).json({
            message:"invalid token"
        })

     }
}

async function authAnyMiddleware(req, res, next) {
    const preferredRole = req.query.role;
    const token = getTokenFromRequest(req, preferredRole);

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (preferredRole && decoded.role !== preferredRole) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        if (decoded.role === "user") {
            const user = await userModel.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ message: "user not found" });
            }
            req.authUser = {
                _id: user._id,
                role: "user",
                fullname: user.fullname,
                email: user.email
            };
            return next();
        }

        if (decoded.role === "foodPartner") {
            const foodPartner = await foodPartnerModel.findById(decoded.id);
            if (!foodPartner) {
                return res.status(401).json({ message: "Partner not found" });
            }
            req.authUser = {
                _id: foodPartner._id,
                role: "foodPartner",
                businessName: foodPartner.businessName,
                email: foodPartner.email
            };
            return next();
        }

        return res.status(403).json({ message: "Access denied" });
    } catch (error) {
        return res.status(401).json({
            message: "invalid token"
        });
    }
}

module.exports={
    authFoodPartnerMiddelware,
    authUsermiddelware,
    authAnyMiddleware
}
