//start server
const app=require("./src/app");
require('dotenv').config();

const connectDB=require('./src/db/db');
connectDB();
app.listen(5000,()=>{
    console.log("server is running on port 5000");
})