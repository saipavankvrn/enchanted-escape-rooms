import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*', // Allow all origins for dev simplicity, restrict in production
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://saipavankvrn:J12Y05@cluster0.zbdu2y4.mongodb.net/escape";

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4 // Use IPv4, skip IPv6
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        // Check for common network/DNS errors
        if (
            (err.name === 'MongoNetworkError') ||
            (err.message && (err.message.includes('ECONNREFUSED') || err.message.includes('querySrv')))
        ) {
            console.error('\n❌ MongoDB Connection Failed: Network/DNS Issue');
            console.error('👉 ACTION REQUIRED:');
            console.error('1. Check MongoDB Atlas > Network Access > Add IP Address > Add Current IP Address.');
            console.error('2. If you are on a restricted network (office/school), this might be a firewall issue.');
            console.error('3. Try using a different DNS (like 8.8.8.8).\n');
        }
    });

// Socket.io
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Make io accessible in routes
app.set('io', io);

// Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('Escape Room API is running');
});

// Import Routes
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';
import adminRoutes from './routes/admin.js';

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

// Only start the server if we're not running as a Vercel function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel
export default app;

// Graceful Shutdown
const shutdown = () => {
    console.log('Shutting down server...');
    httpServer.close(() => {
        console.log('HTTP server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
