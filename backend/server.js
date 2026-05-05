//start server
const app=require("./src/app");
require('dotenv').config();

const connectDB=require('./src/db/db');
const PORT = process.env.PORT || 5000;

connectDB();
app.listen(port,()=>{
    console.log(`server is running on port ${PORT}`);
})