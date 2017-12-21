var config = require('./config_hikSignal');

var kafka = require('kafka-node');

var kafkaClient = kafka.Client;

var HighLevelProducer = kafka.Producer;


/**
 *
 * @param option_
 */
function kafkaReportSignalStatus(option_) {
    this.option = option_;
    this.init();
}

kafkaReportSignalStatus.prototype.init = function () {
    var _this = this;
    _this.connectKafka();
}




kafkaReportSignalStatus.prototype.connectKafka = function(){
    var _this = this;
    console.log('init kafka....',config.reportPara.kafkaHost);
    _this.client = new kafka.Client(config.reportPara.kafkaHost);
    _this.producer = new HighLevelProducer(_this.client);
    _this.producer.connect();
    _this.producer.addListener('ready', function () {
        console.log('Kafka producer is ready');
    });

    _this.producer.on('error', function (err) {
        console.log('error111111111111111111111111', err);
    });

    console.log("kafka init!!");
}

kafkaReportSignalStatus.prototype.uploadSignalStatus = function (subObj,callback) {
    this.constCounter = 0;
    // var serialize_buffer = this.serializeObj(subObj);
    var serialize_buffer = JSON.stringify(subObj);
    this.readySentData(serialize_buffer, callback);
}

/**
 *
 * @param serialize_buf
 * @param callback
 */
kafkaReportSignalStatus.prototype.readySentData = function (serialize_buf, callback) {
    var _this=this;
    _this.producer.send([{topic:config.reportPara.topic,messages:['message']}],function (err,data) {
        if(err){
            console.log(err);
            callback(err);
        }
        else {
            callback(null);
        }
    });
}

module.exports = kafkaReportSignalStatus;
