const express = require('express');
const { Clerk } = require('@clerk/clerk-sdk-node');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();

// Khởi tạo Clerk
const clerk = new Clerk({
    secretKey: process.env.CLERK_SECRET_KEY,
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const decoded = req.user;
        const user = await clerk.users.getUser(decoded.sub);

        res.json({
            accessToken: req.headers.authorization.split(' ')[1],
            claims: {
                userId: decoded.sub,
                email: decoded.email,
                role: user.publicMetadata.role || decoded.role || 'user',
                username: user.username || '',
                image: user.imageUrl || ''
            }
        });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});



module.exports = router;