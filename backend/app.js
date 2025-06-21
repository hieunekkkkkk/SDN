const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const router = require('./src/routes/index');
const adminRoutes = require('./src/routes/admin');
const authRoutes = require('./src/routes/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/swagger/swaggerConfig');
const { metricsMiddleware, metricsEndpoint } = require('./src/middleware/metrics');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Frontend Vite dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1gb' }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Metrics middleware
app.use(metricsMiddleware);
app.get('/metrics', metricsEndpoint);

// Connect to MongoDB
connectDB();


// Routes
app.use('/api', router);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);



module.exports = app;