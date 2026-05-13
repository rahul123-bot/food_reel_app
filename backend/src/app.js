//create server
const express= require('express');
const cookieparser= require('cookie-parser');
const authRoutes= require('./routes/auth.routes');
const foodRoutes= require('./routes/food.routes');
const foodPartnerRoutes = require("./routes/food-partner.routes.js")
const cors= require('cors');

const app= express();


// Allow requests from any origin but reflect the request origin in the
// Access-Control-Allow-Origin header so cookies can be sent (credentials: true).
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
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
// Debug endpoint to inspect cookies from the browser
app.get('/api/debug/cookies', (req, res) => {
    console.log('DEBUG /api/debug/cookies - incoming cookies:', req.cookies);
    res.json({ cookies: req.cookies || {} });
});
app.use('/api/auth',authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner',foodPartnerRoutes);

app.use((err, req, res, next) => {
    if (err && err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'Invalid JSON payload' });
    }

    if (err) {
        console.error('Unhandled app error:', err);
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message || String(err)
        });
    }

    return next();
});

module.exports = app;
