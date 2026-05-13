const foodModel= require('../models/food.model');
const storageService=require('../services/storage.service');
const { v4:uuid }= require('uuid');
const likeModel = require("../models/like.model.js")
const saveModel = require("../models/save.model.js")
const mongoose = require("mongoose")


async function createFood(req,res){
    try {
      console.log('createFood request:', {
        file: !!req.file,
        fileKeys: req.file ? Object.keys(req.file) : null,
        body: { name: req.body?.name, description: !!req.body?.description },
        foodPartner: req.foodPartner ? req.foodPartner._id : null
      });

      if (!req.foodPartner) {
        console.warn('createFood: missing req.foodPartner');
        return res.status(401).json({ message: 'Partner authentication required' });
      }

      if (!req.body || !req.body.name || !req.body.name.trim()) {
        return res.status(400).json({ message: 'Food name is required' });
      }

      if (!req.file || !req.file.buffer) {
        console.warn('createFood: missing req.file or buffer');
        return res.status(400).json({ message: "No video file uploaded" });
      }

      const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid(), req.file.mimetype)

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    console.log('createFood: upload result', fileUploadResult && fileUploadResult.url);
    res.status(201).json({
      message: "food created successfully",
      food: foodItem
    })

}

   catch (error) {
      console.error("createFood error:", error);
      if (error && error.name === 'ValidationError') {
        const details = Object.values(error.errors).map(e => e.message);
        return res.status(400).json({ message: 'Validation failed', details });
      }
      res.status(500).json({
        message: "failed to create food item",
        error: error && error.message ? error.message : String(error)
      });
    }


}
async function getFoodItems(req,res){
  try {
    const foodItems = await foodModel.find({})
    res.status(200).json({
      message:"food item fetched successfully",foodItems
    })
  } catch (error) {
    console.error('getFoodItems error:', error);
    res.status(500).json({
      message: 'failed to fetch food items',
      error: error && error.message ? error.message : String(error)
    });
  }
}
async function likeFood (req,res){
  try {
    const {foodId}= req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Please login first' });
    }

    if (!foodId || !mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({ message: 'Valid foodId is required' });
    }

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
      return res.status(200).json({"message":"food unliked successfully", like: false})
    }
    const likeDoc = await likeModel.create({
      user: user._id,
      food: foodId
    })
    await foodModel.findByIdAndUpdate(foodId,{
      $inc:{likeCount: 1}
    })
    res.status(201).json({"message":"food like successfully", like: true, likeDoc})
  } catch (error) {
    console.error('likeFood error:', error);
    res.status(500).json({
      message: 'failed to like food',
      error: error && error.message ? error.message : String(error)
    });
  }

}
async function saveFood (req,res){
  try {
    const{foodId} = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Please login first' });
    }

    if (!foodId || !mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({ message: 'Valid foodId is required' });
    }

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
      return res.status(200).json({"message":" food unsaved successfully", save: false});
    }
    const saveDoc = await saveModel.create({
      user: user._id,
      food: foodId
    })
    await foodModel.findByIdAndUpdate(foodId,{
      $inc:{saveCount: 1}
    })
    return res.status(201).json({"message":"food save successfully", save: true, saveDoc})
  } catch (error) {
    console.error('saveFood error:', error);
    return res.status(500).json({
      message: 'failed to save food',
      error: error && error.message ? error.message : String(error)
    });
  }
}
async function getSaveFood(req,res){
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Please login first' });
    }

    const saveFoods = await saveModel.find({user: user._id}).populate("user").populate("food");
    if(!saveFoods || saveFoods.length===0){
      return res.status(404).json({"message":"no save food found"});
    }
    res.status(200).json({"message":"save foods retrieved successfully",saveFoods})
  } catch (error) {
    console.error('getSaveFood error:', error);
    return res.status(500).json({
      message: 'failed to load saved food',
      error: error && error.message ? error.message : String(error)
    });
  }
}
module.exports={
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood
}
