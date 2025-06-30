# 📊 ELK Logger Usage Guide

## 🎯 Cách sử dụng Logger trong code

### 1. Import logger:
```javascript
const logger = require('./src/log/logger');
```

### 2. Log các level khác nhau:
```javascript
// Info logs
logger.info('User created successfully', { userId: 123, email: 'user@example.com' });

// Warning logs  
logger.warn('User login attempt with invalid password', { userId: 123, attempts: 3 });

// Error logs
logger.error('Database connection failed', { error: error.message, database: 'mongodb' });

// Debug logs (chỉ hiện trong development)
logger.debug('Processing user data', { step: 'validation', data: userData });
```

### 3. Log HTTP requests (tự động):
```javascript
// Đã được setup trong app.js
app.use(logger.logRequest);
```

### 4. Log Business Events:
```javascript
// Business events
logger.logBusinessEvent('user_registration', {
    userId: user.id,
    email: user.email,
    registrationMethod: 'email',
    timestamp: new Date()
});

logger.logBusinessEvent('payment_processed', {
    orderId: order.id,
    amount: order.total,
    paymentMethod: 'credit_card'
});
```

### 5. Log Errors with context:
```javascript
try {
    // some operation
} catch (error) {
    logger.logError(error, {
        operation: 'user_creation',
        userId: req.body.email,
        additionalData: req.body
    });
    res.status(500).json({ error: 'Internal server error' });
}
```

## 🔍 Index Patterns trong Kibana

### Main Logs:
- **Pattern**: `sdn-logs-*`
- **Time field**: `@timestamp`

### Error Logs:
- **Pattern**: `sdn-errors-*` 
- **Time field**: `@timestamp`

## 📈 Kibana Dashboard Setup

### 1. Truy cập Kibana: http://localhost:5601

### 2. Tạo Index Pattern:
1. Menu > Management > Stack Management
2. Kibana > Index Patterns
3. Create index pattern: `sdn-logs-*`
4. Select time field: `@timestamp`

### 3. Xem logs:
1. Menu > Analytics > Discover
2. Select index pattern: `sdn-logs-*`
3. Filter theo level, service, environment

### 4. Tạo Dashboard:
1. Menu > Analytics > Dashboard
2. Create new dashboard
3. Add visualizations:
   - Log levels over time
   - Error rate
   - Top error messages
   - HTTP status codes

## 🚨 Alerting

### Error Alert Example:
```json
{
  "query": {
    "bool": {
      "must": [
        { "term": { "level": "error" } },
        { "range": { "@timestamp": { "gte": "now-5m" } } }
      ]
    }
  }
}
```

## 📝 Log Format

### Standard Log Structure:
```json
{
  "@timestamp": "2025-06-29T12:30:00.000Z",
  "level": "info",
  "message": "User logged in successfully",
  "service": "api-service",
  "environment": "development",
  "application": "sdn-backend", 
  "userId": 123,
  "duration": "150ms",
  "ip": "192.168.1.100"
}
```

## 🔧 Environment Variables

```bash
# Logger Configuration
LOG_LEVEL=info                    # debug, info, warn, error
LOGSTASH_HOST=logstash           # Logstash hostname
LOGSTASH_PORT=5044               # Logstash TCP port
ELASTICSEARCH_HOST=elasticsearch  # Elasticsearch hostname
NODE_ENV=development             # Environment
```

## 💡 Best Practices

### 1. **Structured Logging**:
```javascript
// ✅ Good
logger.info('User action', {
    action: 'login',
    userId: 123,
    timestamp: new Date(),
    metadata: { ip: req.ip }
});

// ❌ Bad  
logger.info('User 123 logged in at ' + new Date());
```

### 2. **Log Levels**:
- **DEBUG**: Detailed info for debugging
- **INFO**: General information
- **WARN**: Warning conditions  
- **ERROR**: Error conditions

### 3. **Don't log sensitive data**:
```javascript
// ❌ Never log passwords, tokens, credit cards
logger.info('User login', { password: user.password }); // BAD!

// ✅ Log safely
logger.info('User login', { 
    userId: user.id, 
    email: user.email.replace(/(.{2}).*(@.*)/, '$1***$2') 
});
```

## 🎛️ Monitoring & Maintenance

### 1. **Disk Space**: Monitor Elasticsearch disk usage
### 2. **Performance**: Watch Logstash processing rate  
### 3. **Retention**: Configure log retention policies
### 4. **Backup**: Regular Elasticsearch snapshots

## 🔗 Useful Queries

### Find all errors in last hour:
```json
{
  "query": {
    "bool": {
      "must": [
        { "term": { "level": "error" } },
        { "range": { "@timestamp": { "gte": "now-1h" } } }
      ]
    }
  }
}
```

### Find slow requests (>1s):
```json
{
  "query": {
    "bool": {
      "must": [
        { "range": { "duration": { "gte": 1000 } } }
      ]
    }
  }
}
```
