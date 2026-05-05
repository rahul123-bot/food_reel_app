const express=require('express');
const Router=express.Router();
const authMiddelware=require('../middleware/auth.middleware')
const foodcontroller=require('../controller/food.controller')
const multer=require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
})


Router.post('/',authMiddelware.authFoodPartnerMiddelware,
    upload.single("video"),
     foodcontroller.createFood);

Router.get('/',authMiddelware.authUsermiddelware,
    foodcontroller.getFoodItems);  
    
Router.post("/like",authMiddelware.authUsermiddelware, 
    foodcontroller.likeFood)

Router.post("/save",authMiddelware.authUsermiddelware,
    foodcontroller.saveFood)
Router.get("/save",authMiddelware.authUsermiddelware,
    foodcontroller.getSaveFood)


module.exports=Router
