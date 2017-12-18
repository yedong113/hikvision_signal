var protocol = require("./hikVisionProtocol.js")
var devicesSource = require("./devicesSourceFromDB.js")
var config = require("./config.js")
var thenjs = require('thenjs')
var URL = require('url');
var dgram = require('dgram');
var communicationObj = dgram.createSocket('udp4');

var kafkaProducer = require("./kafkaStatusReport.js");

var testPara = require("./lightTestData.js")


function hikVisionServer() {
    this.deviceObjectList = []; //设备列表
    /**数据上报对象*/

    //this.config =  config;
    //this.config.callback = this.reportData;
    this.protocol = new protocol(config);

}





/*api start()*/
hikVisionServer.prototype.start = function() {
    var _this = this;
    this.devicesSource = new devicesSource({
        host: config.mysql.host,
        user: config.mysql.user,
        pwd: config.mysql.pwd,
        database: config.mysql.database
    });
    var url='hik://53.28.100.162:20000';
    var urlbody = URL.parse(url);
    var tmp = {};
    tmp.Id = '5326212777';
    tmp.Url = url;
    tmp.Port = urlbody.port;
    tmp.Ip = urlbody.hostname;
    tmp.DeviceType = 211;
    _this.deviceobjectlist=[tmp];
    thenjs(function(cont) {
        cont(null, null)
            /**获取设备列表
           
            _this.devicesSource.getDeviceList(function(list) {
                if (list.length > 0) {
                    _this.deviceobjectlist = list;
                    cont(null, null)
                } else {
                    cont("notes: no get device list", null)
                }
            });*/
        })
        .then(function(cont, result) {
            //测试列表
            console.log('配置主动拉数据');
            for(var i=0;i<_this.deviceobjectlist.length;i++){
                var url = _this.deviceobjectlist[i].Url;
                var deviceId = _this.deviceobjectlist[i].deviceId;
                var urlbody = URL.parse(url);
                console.log(_this.deviceobjectlist[i]);
                if (urlbody.protocol === 'HIK:' || urlbody.protocol === 'hik:') {
                    console.log(_this.deviceobjectlist[i]);
                    _this.protocol.addListenDevice(_this.deviceobjectlist[i]);
                }
            }
            //_this.createsignaleobject();
            cont(null, null);
        })
        .fin(function(conr, err, result) {
            if (err) {
                console.log(err);
            }
            console.log("call the finally!!");
        })
}

/*api add_task_paramer()*/
hikVisionServer.prototype.add_task_paramer = function(data, callback) {
    this.protocol.configParameter(data, callback);
}


/*api add_task_contrl()*/
hikVisionServer.prototype.add_task_contrl = function(data, callback) {
    this.protocol.changeContrlModule(data, callback);
}





module.exports = hikVisionServer;


/*server.add_task_paramer(testPara, function(ret) {
    console.log("=========add_task_paramer callback!!!==========");
    console.log(ret)
})*/