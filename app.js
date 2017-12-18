'use strict';

var express = require('express');
var dgram = require("dgram");
var bodyParser = require('body-parser');
var http=require('http');
var tonan_light = require('./hikVisionProtocol.js');
var config = require("./config.js")
var app = express();
var  url='TAN://193.168.3.22:8888';
var hikVisionServer = require('./hikVisionServer');
var kmlc2hikvision = require('./kmlc2hikvision.js');

var URL = require('url');


var urlbody = URL.parse(url);

var user_app  = new hikVisionServer();
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
server.listen(1555);
console.log('ports:', 1555);


//var mUdp = new udp_test(config);

function udp_test(options) {
    var this_ = this;
    this.sendObjs = [];
    this.systemDeviceList = [];
    this.options = options;
    this.socket = dgram.createSocket('udp4');
    this.socket.on('message', function(msg, rinfo) {
        console.log("\x1b[33m rec[%s:%s] udp %s\x1b[0m", rinfo.address, rinfo.port, msg.toString('hex'));
        //console.log('got' + msg.length + 'bytes', msg, "from ", rinfo.address, ":", rinfo.port);
        //var msg = new Buffer("hello !" + rinfo.port + rinfo.address);
        //this_.sendData(msg);
    });
    this.socket.on('error', function(err) {
        console.log("server error:\n" + err.stack);
        this_.socket.close();
    });
    this.socket.on('listening', function() {
        var address = this_.socket.address();
        console.log('listening on', address.address, ":", address.port);
    });
    this.socket.on('close', function() {
        console.log("sock close ");
    });

    //this.initkafka();
    // this.testSendDataTimer = setInterval(function() {
    //     this_.sendTest();
    // }, 1000 * 10);

    this.socket.bind(2222);

    };

