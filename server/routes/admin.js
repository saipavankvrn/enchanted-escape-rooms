import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
            .select('username currentLevel completedLevels totalTimeSeconds isCompleted createdAt endTime startTime levelTimestamps hintsUsed')
            .sort({ createdAt: -1 })
            .lean();

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
            end_time: p.endTime,
            start_time: p.startTime,
            level_timestamps: p.levelTimestamps || {},
            hints_used: p.hintsUsed || 0
        }));

        res.json(mappedPlayers);
    } catch (error) {
        console.error('Admin get players error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Reset Level
router.post('/players/:id/reset', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { level } = req.body; // Target level (1-5)

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Reset to specific level
        user.currentLevel = level;
        // Remove completed levels >= the new level
        // e.g. if resetting to level 3, keep 1, 2. Remove 3, 4, 5.
        user.completedLevels = user.completedLevels.filter(l => l < level);
        user.isCompleted = false;
        user.endTime = null;
        user.totalTimeSeconds = null;

        await user.save();

        // Emit socket event for real-time update
        const io = req.app.get('io');
        if (io) {
            io.emit('postgres_changes', { event: 'UPDATE', payload: user });
        }

        res.json({ message: 'Level reset successfully', user });
    } catch (error) {
        console.error('Reset level error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update Time (Add/Deduct)
router.post('/players/:id/time', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { seconds, action } = req.body; // seconds to add/deduct, action: 'add' | 'deduct'

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // If user hasn't started, we can't adjust time meaningfully unless we set start time now?
        // Assume user has startTime.
        if (!user.startTime) {
            // If just started, init start time
            user.startTime = new Date();
        }

        // Logic:
        // Remaining Time = Limit - (Now - StartTime)
        // To INCREASE Remaining Time (Add Time), we need to DECREASE (Now - StartTime).
        // To decrease the difference, we must INCREASE StartTime (push it forward in time).
        // To DECREASE Remaining Time (Penalty), we must DECREASE StartTime (push it back in time).

        const ms = seconds * 1000;

        if (action === 'add') {
            // Give 5 mins -> Move start time 5 mins LATER
            user.startTime = new Date(user.startTime.getTime() + ms);
        } else {
            // Penalty 5 mins -> Move start time 5 mins EARLIER
            user.startTime = new Date(user.startTime.getTime() - ms);
        }

        await user.save();

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.emit('postgres_changes', { event: 'UPDATE', payload: user });
        }

        res.json({ message: 'Time updated successfully', user });
    } catch (error) {
        console.error('Update time error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Reset Timer for User
router.post('/players/:id/reset-timer', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[ADMIN] Resetting timer for user: ${id}`);

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Reset Timer: Set start time to NOW. Clear totalTime.
        user.startTime = new Date();
        user.endTime = null;
        user.totalTimeSeconds = null;
        user.levelTimestamps = {}; // Clear level times
        user.subTasksCompleted = {}; // Clear subtasks
        user.hintsUsed = 0; // Reset hints count if desired, makes sense for a fresh start

        // Option: If we are resetting the timer, maybe we should NOT reset the isCompleted flag if they already won?
        // But usually "Timer Reset" implies giving them another chance to finish within time.
        // If they completed it, resetting timer is weird unless they want to beat their time.
        // Let's set isCompleted to false to allow them to "play" again.
        user.isCompleted = false;

        await user.save();
        console.log(`[ADMIN] Timer reset successfully for user: ${id}`);

        const io = req.app.get('io');
        if (io) {
            io.emit('postgres_changes', { event: 'UPDATE', payload: user });
        }

        res.json({ message: 'Timer reset successfully', user });
    } catch (error) {
        console.error('Reset timer error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete User
router.delete('/players/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[ADMIN] Deleting user: ${id}`);

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            console.log(`[ADMIN] User not found for deletion: ${id}`);
            return res.status(404).json({ error: 'User not found' });
        }

        const io = req.app.get('io');
        if (io) {
            // Emit DELETE event so frontend removes the row
            io.emit('postgres_changes', { event: 'DELETE', payload: { _id: id } });
        }

        console.log(`[ADMIN] User deleted successfully: ${id}`);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create User
router.post('/players/create', adminAuth, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please provide all fields' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user', // Admins created this way are regular players by default
            currentLevel: 1,
            completedLevels: [],
            isCompleted: false
        });

        await newUser.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('postgres_changes', { event: 'INSERT', payload: newUser });
        }

        // Return the created user (sans password)
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                created_at: newUser.createdAt
            }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
