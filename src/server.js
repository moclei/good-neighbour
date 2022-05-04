const bodyParser = require('body-parser')
const path = require('path');
const express = require('express');
const app = express();
const modelRoute = require('./model');
const lb = require('@google-cloud/logging-bunyan');
const {logger, mw} = await lb.express.middleware({
    logName: 'samples_express',
});
const winston = require('winston');
const {LoggingWinston} = require('@google-cloud/logging-winston');

const loggingWinston = new LoggingWinston();
const logger2 = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console(),
        // Add Stackdriver Logging
        loggingWinston,
    ],
});
logger2.error('warp nacelles offline');
logger2.info('shields at 99%');
app.use(mw);
app.use(express.static(path.join(__dirname,"../build")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(express.static('dist'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//    https://good-neighbour-317413.uc.r.appspot.com
const port = process.env.PORT || 8080;
logger.info({port}, 'bonjour');
app.get('/api/getMapsApiKey', modelRoute.getMapsApiKey);
app.get('/*', function(req, res) {
    req.log.info('Bunyan log: sending index.html');
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
