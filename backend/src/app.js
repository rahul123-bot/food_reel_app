//create server
const express= require('express');
const cookieparser= require('cookie-parser');
const authRoutes= require('./routes/auth.routes');
const foodRoutes= require('./routes/food.routes');
const foodPartnerRoutes = require("./routes/food-partner.routes.js")
const cors= require('cors');

const app= express();
const whitelist = [
    'https://food-reel-app-eight.vercel.app',
    'http://localhost:3000'
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieparser());
const path = require('path');
const fs = require('fs');
const uploadsPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.mp4')) {
            res.setHeader('Content-Type', 'video/mp4');
        }
    }
}));

// Debug: list uploaded files (dev only)
app.get('/admin/uploads', (req, res) => {
    try {
        const files = fs.readdirSync(uploadsPath).filter(f => f.slice(-4) === '.mp4');
        res.json({ files });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/",(req,res)=>{
    res.send("hello world");
 })
app.use('/api/auth',authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner',foodPartnerRoutes);

module.exports = app;