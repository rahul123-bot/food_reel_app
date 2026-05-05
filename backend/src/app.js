//create server
const express= require('express');
const cookieparser= require('cookie-parser');
const authRoutes= require('./routes/auth.routes');
const foodRoutes= require('./routes/food.routes');
const foodPartnerRoutes = require("./routes/food-partner.routes.js")
const cors= require('cors');

const app= express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieparser());
app.get("/",(req,res)=>{
    res.send("hello world");
 })
app.use('/api/auth',authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner',foodPartnerRoutes);

module.exports = app;