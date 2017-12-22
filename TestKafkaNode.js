var kafka = require('kafka-node');
var HighLevelProducer = kafka.HighLevelProducer;
var Client = kafka.Client;
var client = new Client('ZK01:19092');
var topic = 'ITSCRealData';
var count = 10;
var rets = 0;
var thenjs = require('thenjs');

thenjs(function(cont){
        console.log("then 1");
        cont(null,'result');
    })
    .then(function(cont,result){
        console.log('then 2',result);
        cont(null,'err','result');
    })
    .then(function(cont,err,result){
        console.log('then 3',err,result);
        cont(null,null);
    })
    .fin(function(cont,err,result){
        console.log('then 4');
    });

