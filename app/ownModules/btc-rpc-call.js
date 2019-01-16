const btc_rpc = require('node-bitcoin-rpc');

var Promise = require('promise');

module.exports.rpc_call = function(username,method,params){
    return new Promise(function (resolve, reject){
        btc_rpc.call(username,method,params,function(err,result){
            if(err)
                reject(err)
            else
                resolve(result)
        })
    });
}