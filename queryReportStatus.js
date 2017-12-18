var net = require('net');


function queryReportStatus(_option){
    var _this = this;
    this.option = _option;
    this.socket = _option.socket;
    this.ip=_option.ip;
    this.port=_option.port;
    setInterval(function(){
        _this.keepAlive();
        },10000);
}


queryReportStatus.prototype.keepAlive = function(){
    var this_ = this;
//    console.log('主动拉取信号机状态数据',this_.ip,this_.port);
    var data = new Buffer('6e6e000059010000', 'hex');
//    this_.socket.send(data, 0, data.length, this_.port, this_.ip, function(err, bytes) {});
}





module.exports = queryReportStatus;