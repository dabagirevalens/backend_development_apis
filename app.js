const express = require("express");
const app = express();
require("dotenv").config();

const cors = require("cors");
app.use(cors())

app.use('/public', express.static(process.cwd() + '/public'));
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/index.html');
});


const timestampRouter = require('./routes/timeStamp');
const exerciseTrackerRouter = require('./routes/exerciseTracker');
const urlShortenerRouter = require('./routes/urlShortener');

app.use('/api/timestamp', timestampRouter);
app.use('/api/users', exerciseTrackerRouter);
app.use('/api/url', urlShortenerRouter);


const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
