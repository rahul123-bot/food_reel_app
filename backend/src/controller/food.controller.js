const foodModel= require('../models/food.model');
const storageService=require('../services/storage.service');
const { v4:uuid }= require('uuid');
const likeModel = require("../models/like.model.js")
const saveModel = require("../models/save.model.js")
const mongoose = require("mongoose")


async function createFood(req,res){
    try {
      const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "food created successfully",
        food: foodItem
    })

}

   catch (error) {
      console.error("createFood error:", error);
      res.status(500).json({
        message: "failed to create food item"
      });
    }


}
async function getFoodItems(req,res){
  const foodItems = await foodModel.find({})
  res.status(200).json({
    message:"food item fetched successfully",foodItems
  })
}
async function likeFood (req,res){
  const {foodId}= req.body;
  const user = req.user
  const isAlreadyLike = await likeModel.findOne({
    user: user._id,
    food: foodId
  })
  if(isAlreadyLike){
    await likeModel.deleteOne({
      user: user._id,
      food: foodId
    })
    await foodModel.findByIdAndUpdate(foodId,{
      $inc: {likeCount: -1}
    })
    return res.status(200).json({"message":"food unliked successfully"})
  }
  const like = await likeModel.create({
    user: user._id,
    food: foodId
  })
  await foodModel.findByIdAndUpdate(foodId,{
    $inc:{likeCount: 1}
  })
  res.status(201).json({"message":"food like successfully",like})

}
async function saveFood (req,res){
  const{foodId} = req.body;
  const user = req.user;
  const isAlreadySave = await saveModel.findOne({
    user: user._id,
    food: foodId
  });
  if(isAlreadySave){
    await saveModel.deleteOne({
       user: user._id,
       food: foodId
    })
    await foodModel.findByIdAndUpdate(foodId,{
      $inc:{saveCount: -1}
    })
    return res.status(200).json({"message":" food unsaved successfully"});
  }
  const save = await saveModel.create({
    user: user._id,
    food: foodId
  })
  await foodModel.findByIdAndUpdate(foodId,{
    $inc:{saveCount: 1}
  })
  return res.status(201).json({"message":"food save successfully",save})
}
async function getSaveFood(req,res){
  const user = req.user
  const saveFoods = await saveModel.find({user: user._id}).populate("user").populate("food");
  if(!saveFoods || saveFoods.length===0){
     return res.status(404).json({"message":"no save food found"});
  }
  res.status(200).json({"message":"save foods retrieved successfully",saveFoods})
}
module.exports={
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood
}
