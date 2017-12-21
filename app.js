'use strict';
var express = require('express');
var dgram = require("dgram");
var bodyParser = require('body-parser');
var http=require('http');
var config = require("./config_hikSignal.js")
var hikLightProtocolServer = require('./hikLightProtocolServer.js');
var kmlc2hikvision = require('./kmlc2hikvision.js');
var URL = require('url');


var app = express();
var user_app  = new hikLightProtocolServer();
user_app.start();

app.use(bodyParser.json());

app.post('/light/paramer', function (req, res) {
    var data = req.body;
    var lc2hik = new kmlc2hikvision(data);
    res.send({ result: "success" });
});



app.post('/light/contrl',function(req,res){
    var data = req.body;
    user_app.add_task_contrl(data,function(result){
      console.log('contrl:',result);
      res.header({"Access-Control-Allow-Origin":"*"});
      if(result.errCode){
        res.send({result:"fail",msg:{errcode:result.errCode,info:"fail" }});
      }else{
        res.send({result:"success"});
      }
    });
});



var server = http.createServer(app);
server.listen(config.port);
console.log('ports:', config.port);
