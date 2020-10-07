const async = require('async');
const Q = require('q');
const logger = require('../logger');
const server = require('../bin/www');
const initDbConnection = require('../persistence/dbConnection');
const initMysqlDbAndTables = require('./initMysqlDbAndTables');

const initFunctions = [
    {promiseMethod: initDbConnection},
    {promiseMethod: initMysqlDbAndTables},
    {promiseMethod: server.startServer}
];

const executePromises = function (params) {
    const defer = Q.defer();
    try {
        async.eachSeries(params.promiseArray, function (currentPromiseObj, callback) {
            try {
                params.logger.info({'msg':'inprocess',promiseMethod:currentPromiseObj.promiseMethod.name});
                if (currentPromiseObj.sync) {
                    currentPromiseObj.promiseMethod(currentPromiseObj.params);
                    params.logger.info({'msg':"success",promiseMethod:currentPromiseObj.promiseMethod.name});
                    callback();
                }
                else {
                    currentPromiseObj.promiseMethod(currentPromiseObj.params).then(function () {
                        params.logger.info({'msg':"success",promiseMethod:currentPromiseObj.promiseMethod.name});
                        callback();
                    }, function (err) {
                        params.logger.error({err_name:'PROMISE_METHOD_ERROR',promiseMethod:currentPromiseObj.promiseMethod.name,err_stk:err.stack});
                        if(currentPromiseObj.skipErrors)
                            callback();
                        else
                            callback(err);
                    })
                }
            }
            catch (ex) {
                params.logger.error({err_name:'PROMISE_METHOD_EXCEPTION',promiseMethod:currentPromiseObj.promiseMethod.name,err_stk:ex.stack});
                if(currentPromiseObj.skipErrors)
                    callback();
                else
                    callback(ex);
            }
        }, function (err) {
            if (err) {
                params.logger.error({err_name:'PROMISE_ARRAY_ERROR',err_stk:err.stack});
                defer.reject(err);
            }
            else
                defer.resolve();
        })
    }
    catch (ex) {
        params.logger.error({err_name:'PROMISE_ARRAY_EXCEPTION',err_stk:ex.stack});
        defer.reject(ex);
    }
    return defer.promise;
};

var init = function () {
    try {
        executePromises({
            promiseArray: initFunctions,
            sequence: true,
            logger: logger
        }).then(function () {
            logger.info({msg: 'INIT_SUCCESS'});
            logger.info({msg: 'Application running on http://127.0.0.1/'});
        }, function (err) {
            logger.error({err_name: 'INIT_FAILURE', err_stk: err.stack});
        });
    }
    catch (ex) {
        logger.error({err_name: 'INIT_FAILURE', err_stk: ex.stack});
    }
};

init();