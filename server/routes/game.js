import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this';

// Middleware to verify token
const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });

        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Get Game State
router.get('/state', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            current_level: user.currentLevel,
            completed_levels: user.completedLevels,
            start_time: user.startTime,
            end_time: user.endTime,
            total_time_seconds: user.totalTimeSeconds,
            is_completed: user.isCompleted
        });
    } catch (error) {
        console.error('Get game state error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Save Game State
router.post('/save', auth, async (req, res) => {
    try {
        const {
            currentLevel,
            completedLevels,
            startTime,
            endTime,
            totalTimeSeconds,
            isCompleted
        } = req.body;

        const updateData = {};
        if (currentLevel !== undefined) updateData.currentLevel = currentLevel;
        if (completedLevels !== undefined) updateData.completedLevels = completedLevels;
        if (startTime !== undefined) updateData.startTime = startTime;
        if (endTime !== undefined) updateData.endTime = endTime;
        if (totalTimeSeconds !== undefined) updateData.totalTimeSeconds = totalTimeSeconds;
        if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: updateData },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Emit socket event for real-time admin dashboard
        const io = req.app.get('io');
        io.emit('postgres_changes', {
            // Mimic Supabase structure for easier frontend migration on Admin side
            // Or just emit a custom event. Let's mimic what Admin.tsx expects roughly
            // Admin.tsx listens to 'postgres_changes' on 'public' schema 'profiles' table.
            // But socket.io client usage is different. We will refactor Admin.tsx to listen to 'player_update'
            eventType: 'UPDATE',
            new: {
                id: user._id,
                current_level: user.currentLevel,
                completed_levels: user.completedLevels,
                is_completed: user.isCompleted,
                total_time_seconds: user.totalTimeSeconds,
                end_time: user.endTime,
                username: user.username
                // Add other fields if needed
            }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Save game state error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
