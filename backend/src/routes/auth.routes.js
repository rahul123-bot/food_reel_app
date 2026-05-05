const express=require('express');
const authcontroller= require('../controller/auth.controller')
const authMiddleware = require('../middleware/auth.middleware');
const Router= express.Router();

//user auth apis
Router.post("/user/register",authcontroller.registerUser)
Router.post("/user/login",authcontroller.loginUser)
Router.get("/user/logout",authcontroller.logoutUser)

Router.get("/me",authMiddleware.authAnyMiddleware,authcontroller.getMe)
//foodpartner auth apis
Router.post("/food-partner/register",authcontroller.registerFoodPartner)
Router.post("/food-partner/login",authcontroller.loginFoodPartner)
Router.get("/food-partner/logout",authcontroller.logoutFoodPartner)
module.exports=Router;
