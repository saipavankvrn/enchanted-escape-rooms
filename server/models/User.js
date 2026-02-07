import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // Game State embedded
    currentLevel: {
        type: Number,
        default: 1
    },
    completedLevels: {
        type: [Number],
        default: []
    },
    startTime: {
        type: Date,
        default: null
    },
    endTime: {
        type: Date,
        default: null
    },
    levelTimestamps: {
        type: Object, // Stores { 1: timestamp, 2: timestamp, ... }
        default: {}
    },
    subTasksCompleted: {
        type: Object, // Stores { 1: [task1, task2, ...], 2: [...] }
        default: {}
    },
    totalTimeSeconds: {
        type: Number,
        default: null
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

export default User;
