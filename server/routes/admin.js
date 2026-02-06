import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this';

// Middleware to verify admin token
const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });

        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Get All Players
router.get('/players', adminAuth, async (req, res) => {
    try {
        const players = await User.find({ role: 'user' }) // Optionally filter out admins
            .select('username currentLevel completedLevels totalTimeSeconds isCompleted createdAt endTime')
            .sort({ createdAt: -1 });

        // Map to match frontend expected structure if slightly different, 
        // but the model was designed to match mostly.
        // Frontend expects: id, username, current_level, completed_levels, ... (snake_case from Supabase types)
        // We can map it here or change frontend. Let's map it here to minimize frontend changes for now/

        const mappedPlayers = players.map(p => ({
            id: p._id,
            username: p.username,
            current_level: p.currentLevel,
            completed_levels: p.completedLevels,
            total_time_seconds: p.totalTimeSeconds,
            is_completed: p.isCompleted,
            created_at: p.createdAt,
            end_time: p.endTime
        }));

        res.json(mappedPlayers);
    } catch (error) {
        console.error('Admin get players error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
