var winston = require('winston');
winston.emitErrs = true;
var logger;
var projectEnv = require('./config/projectEnv').projectEnv;
var logs = projectEnv.logs.transports;
var boolConsole = projectEnv.logs.console;

var addDefaultValue = function(transportObj)
{
    transportObj['datePattern']='.yyyy-MM-dd';
    transportObj['handleExceptions']=true;
    transportObj['json']=true;
    transportObj['maxFiles']=5;
    transportObj['colorize']=false;
};

var populateTransportArray = function() {
    var transportArray=[];
    for (var index in logs) {
        var currentLog = logs[index];
        var transportObj = {};
        transportObj['name'] = currentLog['name'];
        transportObj['level'] = currentLog['level'];
        transportObj['filename'] = currentLog['filename'];
        addDefaultValue(transportObj);
        transportArray.push(new winston.transports.DailyRotateFile(transportObj));
    }

    console.log("boolConsole : "+ boolConsole);

    if(boolConsole != undefined) {
        transportArray.push(new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        }))
    }
    return transportArray;
};

logger = new winston.Logger({
    transports: populateTransportArray(),
    exitOnError: false
});

module.exports = logger;