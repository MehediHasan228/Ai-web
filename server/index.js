const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./prismaClient');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: ['https://mehedihasan228.github.io', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Savora Admin API' });
});

// Database Connection check
console.log('⌛ Connecting to Database...');
prisma.$connect()
    .then(() => console.log('✅ Connected to Database via Prisma'))
    .catch((err) => {
        console.error('❌ Prisma Connection Error:', err);
        process.exit(1);
    });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/users', require('./routes/users'));
app.use('/api/grocery', require('./routes/grocery'));
app.use('/api/database', require('./routes/database'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/external/recipes', require('./routes/externalRecipes'));
app.use('/api/system', require('./routes/system'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
