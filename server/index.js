require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const homes = require('./routes/api/homes.js');

const app = express();
const port = process.env.PORT || 3003;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// send index.html when a GET request is sent to '/'
app.use(express.static(path.join(__dirname, '../client/dist')));

// Use Router
app.use('/nearbyHomes', homes);
app.use('/api/nearbyHomes', homes);

app.listen(port, () => {
  console.log(`server is running at: http://localhost:${port}`);
});
