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

// Request ID middleware
app.use((req, res, next) => {
    req.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    res.setHeader('X-Request-ID', req.id);
    next();
});

// Metrics endpoint - đặt trước CORS để Prometheus có thể truy cập
app.get('/metrics', metricsEndpoint);



// Metrics middleware
app.use(metricsMiddleware);

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://smearch.io.vn',
        'http://react-app:5173',  // Docker container name
        'http://frontend-react-app-1:5173'  // Docker compose service name
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json({ limit: '1gb' }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// // Metrics endpoint - không áp dụng CORS để Prometheus có thể truy cập
// app.get('/metrics', (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// }, metricsEndpoint);

// Connect to MongoDB
connectDB();


// Routes
app.use('/api', router);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);



module.exports = app;