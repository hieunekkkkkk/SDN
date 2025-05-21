const express = require('express');
const { connect } = require('mongoose');
const router = require('./src/routes/index.js');
const dotenv = require('dotenv');
const morgan = require('morgan');
var cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./src/config/db.js');
const app = express();
dotenv.config();
app.use(cors());


app.use(morgan('dev'));

//Cônection to MongoDB
connectDB();

// For parsing application/json
app.use(express.json());
app.use(bodyParser.json());
app.use('/', router);

router.get("/test", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.listen(process.env.PORT, () => {
  console.log(`server is running at http://localhost:${process.env.PORT}`);
});
