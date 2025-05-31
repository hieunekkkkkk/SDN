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
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(metricsMiddleware);
// Endpoint for metrics
app.get('/metrics', metricsEndpoint);

// Connect to MongoDB
// connectDB();

// Routes
app.use('/api', router);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

module.exports = app;