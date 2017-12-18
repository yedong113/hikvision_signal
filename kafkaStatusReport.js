/**信号机状态上报的接口 by kafka*/


/****************************************************
notes:
1、kafka 初始化失败或者断线以后怎么处理
2、没有获取到设备列表时和处理。
*****************************************************/
var node_rdkafka = require('node-rdkafka');
var protobuf = require('node-protobuf');
var kafka_config = require("./config_hikSignal.js");
var fs = require('fs');

/** */

/**/
var pb = new protobuf(fs.readFileSync("./protobuf/ITSCRealData.desc"));


function kafkaReportStatusSignal(options_) {
    this.options = options_;
    this.constCounter = 0; // 300s => 5min
}

/// 初始连接kafka.
kafkaReportStatusSignal.prototype.init = function() {
    var _this = this;
    this.recTimer = setInterval(function() {
        _this.constCounter = _this.constCounter + 1;
        if (_this.constCounter >= 540) {
            _this.constCounter = 0;
            _this.connectKafka();
        }
    }, 1000);

    _this.connectKafka();
}

kafkaReportStatusSignal.prototype.connectKafka = function() {
    var _this = this;
    this.kafkaIsReady = false;
    if (this.producer) {
        this.constCounter = 0;
        this.producer = null;
    }

    this.producer = new node_rdkafka.Producer({
        'client.id': 'kafka_WEITING',
        'metadata.broker.list': kafka_config.reportPara.kafkaHost,
        'retry.backoff.ms': 200,
        'message.send.max.retries': 1,
        'socket.keepalive.enable': true,
        'queue.buffering.max.messages': 2048040,
        'queue.buffering.max.ms': 100,
        'batch.num.messages': 1,
        //  'fetch.message.max.bytes':4194304,
        'message.max.bytes': 4194304,
        'dr_cb': true
    });

    this.producer.connect({}, function(err) {
            if (err) {
                _this.kafkaIsReady = false;
                // readyToSentMsg();
            }
        })
        .on('error', function(e) {
            console.log('err->>' + e);
            //_this.kafkaIsReady = false;
        })
        .on('ready', function() {
            console.log("kafka is ready!");
            _this.kafkaIsReady = true;
        })
        .on('disconnected', function() {
            //_this.kafkaIsReady = false;
            console.log("kafka is disconnected!!");
        });

    console.log("kafka init!!");
}

/// 提交过车数据。
kafkaReportStatusSignal.prototype.uploadSignalStatus = function(subObj, callback) {
    this.constCounter = 0;
    // var serialize_buffer = this.serializeObj(subObj);
    var serialize_buffer = JSON.stringify(subObj);
//    console.log(subObj);
    var a = '10';
    a = subObj.Id.substr(-1);
    this.readySentData(a, serialize_buffer, callback);
}



kafkaReportStatusSignal.prototype.readySentData = function(topic, serialize_buf, callback) {
    if (!this.kafkaIsReady) {
        console.log(" kafka not ready!!");
        return;
    }
    this.sent(kafka_config.reportPara.topic, serialize_buf, callback);
}

kafkaReportStatusSignal.prototype.serializeObj = function(obj) {
    try {
        var buf = pb.serialize(obj, "ITSCRealData");
        return buf;
    } catch (e) {
        console.log("->>:serializeObj err" + e);
    }
}


kafkaReportStatusSignal.prototype.sent = function(topic, moudle, callback) {
    var partition =0;
    try{     
        console.log(topic,moudle);    
        this.producer.produce(topic,partition,new Buffer(moudle),moudle,Date.now());
        callback(null);
    }
    catch(err){
        callback(err);
    }
}

module.exports = kafkaReportStatusSignal;


// var kafka = new kafkaReportStatusSignal();
// kafka.init();
// setInterval(function(){
//     console.log(1111);
//     if(kafka.kafkaIsReady){
//         console.log("send data start...")
//         kafka.uploadSignalStatus(testData,function(err){
//             if(err)
//                 console.log("send kafka return data:",err);
//         });
//     }
// },1000)