var dgram = require("dgram");
var fs = require('fs');
var toolFunc = require('./utils.js');
var log = toolFunc.log;
var kafkaProducer = require("./kafkaStatusReport.js");
var queryReportStatus = require('./queryReportStatus.js');
var pad = require('./pad.js');
var channelConfig = require('./channelConfig.js');

var util = require('util');
var EventEmitter = require('events').EventEmitter;

function hikvision_proto(options) {
    var this_ = this;
    this.sendObjs = [];
    this.systemDeviceList = [];
    this.options = options;

    this.reportObject = new kafkaProducer();
    this.reportObject.init(); //

    this.socket = dgram.createSocket('udp4');
    this.socket.on('message', function(msg, rinfo) {
        this_.parseFrameV1(msg, rinfo);
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
        
        //addListenDevice
        console.log('listening on', address.address, ":", address.port);
    });
    this.socket.on('close', function() {
        console.log("sock close ");
    });

    //this.initkafka();
    // this.testSendDataTimer = setInterval(function() {
    //     this_.sendTest();
    // }, 1000 * 10);

    this.socket.bind(this.options.UDPListenPort);

    this.next = function(numberOK, deviceObject) {
        clearTimeout(deviceObject.fsm.sendTimer);
        var sends = deviceObject.fsm.sends;
        var sendType = sends[0].sendType;
        sends.shift();
        if (sends.length > 0) {
            ++sends[0].count;
            this_.sendData(sends[0].buf, deviceObject);
            console.log("\x1b[33m send one sucess! send next !\x1b[0m");
        } else {
            var err = {
                errCode: 0,
                msg: 'success'
            };
            console.log("\x1b[33m !!!!!!!!!!!!!config sucess!!!!!!!!!!\x1b[0m");
            this_.SetCb(err, sendType, numberOK);
        }
    };

    this.reTry = function(numberErr, deviceObject) {
        clearTimeout(deviceObject.fsm.sendTimer);
        var sends = deviceObject.fsm.sends;
        if (sends[0].count > 3) {
            var err = {
                errCode: -1,
                msg: 'failed'
            };
            this_.SetCb(err, sends[0].sendType, numberErr);
        } else {
            ++sends[0].count;
            this_.sendData(sends[0].buf, deviceObject);
        }
    };
}



hikvision_proto.prototype.add_task_paramer = function(data,callback){
//    var _this = 
}





//设置参数
/**********设置参数接口******************************/
hikvision_proto.prototype.configParameter = function(data, callback) {
    var deviceObj = this.getDeviceObjectById(data.Id);
    deviceObj={};
    if (!deviceObj) { //设备不在
        callback({
            errCode: "not found device"
        });
        return;
    }
};



hikvision_proto.prototype.printArrary4Hex = function(data) {
    var result = '';
    for (var iix = 0; iix < data.length; iix++) {
        var len = data[iix].length;
        for (var iiy = 0; iiy < len; iiy++) {
            result = result + toolFunc.Value2HexString(data[iix][iiy], 1);
            // console.log(toolsFunc.Value2HexString(data[iix][iiy],1))
        }
    }
    return result;
};


/**********切换工作模式接口***********************************/
hikvision_proto.prototype.changeContrlModule = function(data, callback) {
    this.SetCb = callback;
    var deviceCounter = this.systemDeviceList.length;
    var deviceContain = false;
    var deviceObj = null;
    console.log('deviceCounter is:', deviceCounter);
    for (var iix = 0; iix < deviceCounter; iix++) {
        if (data.Id == this.systemDeviceList[iix].Id) {
            deviceContain = true;
            deviceObj = this.systemDeviceList[iix];
        }
    }

    if (!deviceContain) {
        callback({
            errCode: "not found device"
        });
        return;
    }

    console.log(data);
    return;

    /******change the working module******************/
    var contrlType = 30; //默认为退出手动模式
    var type = data.CtrlType;
    var subtype = data.CtrlMode;
    if (type == 0xD1) {
        if (subtype == 0xFD) { /*全红*/
            contrlType = 10;
        } else if (subtype == 0xFE) { /*黄闪*/
            contrlType = 22;
        } else if (subtype == 0xFF) { /*关闭信号灯*/
            contrlType = 23;
        }
    }

    var result = 'dddd' + '0000' + toolFunc.Value2HexString(contrlType, 1) + toolFunc.Value2HexString(contrlType, 1);
    var buf = new Buffer(result, 'hex');

    var ob = {
        'count': 0,
        'sendType': 'C',
        'index': contrlType,
        'buf': buf
    };
    deviceObj.fsm.sends.push(ob);
    this.sendData(buf, deviceObj);
};

hikvision_proto.prototype.onOK = function(param, rinfo) {
    //方案号 0-40
    //时段号 0-19
    //工作表 only 0
    if (this.currentSend = 'Collect') {
        return;
    }
    var numberOK = param[0];
    this.next(numberOK, rinfo);
};

hikvision_proto.prototype.onError = function(param, rinfo) {
    //方案号 0-40
    //时段号 0-19
    //工作表 only 0
    if (this.currentSend = 'Collect') {
        return;
    }
    var numberErr = param[0];
    this.reTry(numberErr, rinfo);
};


hikvision_proto.prototype.parseFrameV1 = function(data,rinfo){
    var _this = this;
    var bodyData = data.slice(4);
    var mainType = bodyData[0];
    var subType = bodyData[1];
    var deviceObj = this.getDeviceObjectByIp(rinfo.address);
    console.log('mainType=0x'+mainType.toString(16),'sub=0x'+subType);
    _this.parseStatus(bodyData,deviceObj);
    
}


hikvision_proto.prototype.parseStatus = function(data,deviceObj){
    var _this = this;
    var statusData = data.slice(4);
    var dataRow = {};
    dataRow.Id = deviceObj.Id;
    dataRow.CtrlMode = 0; //toolFunc.parseRunningMode(objsBody[9]);//定周期	 分时段 自适应 全红 闪光  关灯
    dataRow.PlanID = 0; //显示当前执行的方案号
    dataRow.CycleTime = 0; //周期时间
    dataRow.StepTotal = 0; //总步数
    dataRow.StepNow = 0; //当前步序号
    dataRow.StepLen = 0; //当前步的时长(单位秒)
    dataRow.StepSurplusTime = 0; //当前步的剩余时间(单位秒)
    dataRow.MinGreenTime = 0; //最小绿
    dataRow.MaxGreenTime = 0; //最大绿
    dataRow.CrossStatusInfo = _this.parseChannelStatus(statusData);
    console.log(dataRow);
}

hikvision_proto.prototype.parseChannelStatus = function(data){
    var redChannelStatus = data[1]+data[5]*256;
    var greenChannelStatus = data[3]+data[7]*256;
    var yellowChannelStatus = data[2]+data[6]*256;
    var CrossStatusInfo=[];
    var roadstatus = [
        {RoadId:1,DirectLine:0,LeftLine:0,RightLine:0,WalkLime:0},
        {RoadId:2,DirectLine:0,LeftLine:0,RightLine:0,WalkLime:0},
        {RoadId:3,DirectLine:0,LeftLine:0,RightLine:0,WalkLime:0},
        {RoadId:4,DirectLine:0,LeftLine:0,RightLine:0,WalkLime:0},
        {RoadId:5,DirectLine:0,LeftLine:0,RightLine:0,WalkLime:0},
        {RoadId:6,DirectLine:0,LeftLine:0,RightLine:0,WalkLime:0},
        {RoadId:7,DirectLine:0,LeftLine:0,RightLine:0,WalkLime:0},
        {RoadId:8,DirectLine:0,LeftLine:0,RightLine:0,WalkLime:0}
    ];
    
    var reds = pad(redChannelStatus.toString(2),16,'0','l');
    var greenS = pad(greenChannelStatus.toString(2),16,'0','l');
    var yellowS = pad(yellowChannelStatus.toString(2),16,'0','l');
    for(var i=reds.length-1,j=0;i>=0,j<=15;i--,j++){
        var tmpStatus = reds[i];
        var channel=channelConfig.chanel[j];
        if(tmpStatus=='1'&&channel.type!=3){
            if(channel.type==4){
                roadstatus[channel.roadid-1].WalkLime=3;
            }
            else if(channel.type==2){
                roadstatus[channel.roadid-1].DirectLine=3;
            }
            else if(channel.type==1){
                roadstatus[channel.roadid-1].LeftLine=3;
            }
        }
        tmpStatus = greenS[i];
        if(tmpStatus=='1'&&channel.type!=3){
            if(channel.type==4){
                roadstatus[channel.roadid-1].WalkLime=1;
            }
            else if(channel.type==2){
                roadstatus[channel.roadid-1].DirectLine=1;
            }
            else if(channel.type==1){
                roadstatus[channel.roadid-1].LeftLine=1;
            }
        }
        tmpStatus = yellowS[i];
        if(tmpStatus=='1'&&channel.type!=3){
            if(channel.type==4){
                roadstatus[channel.roadid-1].WalkLime=5;
            }
            else if(channel.type==2){
                roadstatus[channel.roadid-1].DirectLine=5;
            }
            else if(channel.type==1){
                roadstatus[channel.roadid-1].LeftLine=5;
            }
        }
    }

    for(var i=0;i<=7;i++){
        var croseStatus = roadstatus[i];
        var status = 0;
        var manColor = 0; //人行(1)
        var rightColr = 0; //[2]bit  6 5 4
        var straightColor = 0; //bit 2 1 0
        var leftColor = 0; //bit 6 5 4

        if(croseStatus.WalkLime==3){//
            manColor= 0b01;
        }else if(croseStatus.WalkLime==1){//
            manColor= 0b11;
        }else if(croseStatus.WalkLime==5){//
            manColor= 0b10;
        }

        if(croseStatus.DirectLine==3){//
            straightColor= 0b01;
        }else if(croseStatus.DirectLine==1){//
            straightColor= 0b11;
        }else if(croseStatus.DirectLine==5){//
            straightColor= 0b10;
        }

        if(croseStatus.LeftLine==3){//
            leftColor= 0b01;
        }else if(croseStatus.LeftLine==1){//
            leftColor= 0b11;
        }else if(croseStatus.LeftLine==5){//
            leftColor= 0b10;
        }
        status |= manColor << 6;
        status |= rightColr << 4;
        status |= straightColor << 2;
        status |= leftColor;
        CrossStatusInfo.push({CrossID:croseStatus.RoadId,Status:status});
    }
    return CrossStatusInfo;
}


function paddingZero(value, length) {
    if (!length) length = 2;
    value = String(value);
    var zeros = '';
    for (var i = 0; i < (length - value.length); i++) {
        zeros += '0';
    }
    return zeros + value;

}

//实时数据读
hikvision_proto.prototype.parseRealState = function(param, data, deviceObj) {
    var realData = {};
    var time = (2000 + data[0]).toString() + "-" + paddingZero(data[1].toString()) + "-" + paddingZero(data[2].toString()) + " " +
        paddingZero(data[3].toString()) + ":" + paddingZero(data[4].toString()) + ":" + paddingZero(data[5].toString());
    realData.Id = deviceObj.Id;
    realData.Time = time;
    realData.CtrlMode = data[9]; //方案运行模式
    realData.PeriodID = data[8]; //时段号； 当前正在运行的时段号
    realData.PlanID = data[11]; //方案号；
    realData.StepTotal = data[12]; //总步数
    realData.StepNow = data[13]; //当前步
    realData.StepSurplusTime = data[14]; //当前步已走时间
    realData.CycleTime = data[15] * 10 + data[16]; ////周期时间
    realData.StepLen = data[18]; //当前步的时长(单位秒)
    realData.MinGreenTime = data[44]; //最小绿
    realData.MaxGreenTime = data[45]; //最大绿  

    realData.BigDoor = data[100]; ////大门状态： 0x55 关； 0xaa 开
    realData.SmallDoor = data[101]; //小门状态： 0x55 关； 0xaa 开

    var lightData = data.slice(31, 31 + 12); //下半秒信号灯
    var CrossStatusInfo = [];
    for (var i = 0; i < 8; ++i) {
        var crossStatus = {};
        crossStatus.CrossID = i + 1;
        crossStatus.Status = 0;
        CrossStatusInfo.push(crossStatus);
    }
    var startIndex = 0;
    var crossId = [3, 5, 7, 1];
    for (var corner = 0; corner < 4; ++corner) { //3 5 7 1路口信号灯状态
        var cornerData = lightData.slice(startIndex, startIndex + 3);
        startIndex += 3;
        //[0]:调头灯组+全屏灯组+人行（1）[1]:左转灯组+直行灯组+人行（2）[2]:右转灯组+右转专用道灯组+右转专用道人行
        CrossStatusInfo[crossId[corner] - 1].Status = toolFunc.createStatus(cornerData);
    }
    realData.CrossStatusInfo = CrossStatusInfo;
    var res={};
    res.oper='1111';
    res.data=realData;
    return res;
};


hikvision_proto.prototype.getDeviceObjectById = function(Id) {
    var deviceCounter = this.systemDeviceList.length;
    console.log('deviceCounter is:', deviceCounter);

    var deviceObj = null;
    for (var iix = 0; iix < deviceCounter; iix++) {
        if (Id == this.systemDeviceList[iix].Id) {
            deviceObj = this.systemDeviceList[iix];
        }
    }
    return deviceObj;
};


hikvision_proto.prototype.getDeviceObjectByIp = function(Ip) {
    var deviceCounter = this.systemDeviceList.length;
    console.log('deviceCounter is:', deviceCounter);

    var deviceObj = null;
    for (var iix = 0; iix < deviceCounter; iix++) {
        if (Ip == this.systemDeviceList[iix].Ip) {
            deviceObj = this.systemDeviceList[iix];
        }
    }
    return deviceObj;
};

hikvision_proto.prototype.sendData = function(data, deviceObj, cb) {
    var self = this;
    this.socket.send(data, 0, data.length, deviceObj.Port, deviceObj.Ip, function(err, bytes) {
        if (err) {
            console.log(err);
            if (cb != null) {
                cb({
                    'errCode': -1,
                    'msg': 'send failed'
                });
            }
            return;
        }
        //console.log('send bytes :', bytes);
        console.log("send[", deviceObj.Ip, ":" + deviceObj.Port + "]>> ", data);
        if (cb != null) {
            cb({
                'errCode': 0,
                'msg': 'send success'
            });
        }
    });

    deviceObj.fsm.sendTimer = setTimeout(function() {
        console.log("wait respond timeout!");
        var sends = deviceObj.fsm.sends;

        if (sends[0].count >= 3) {
            var err = {
                errCode: -1,
                msg: 'failed'
            };
            self.SetCb(err, sends[0].sendType, sends[0].index);
        } else {
            ++sends[0].count;
            self.sendData(sends[0].buf, deviceObj);
        }
    }, 3000);
};

/***************info 为包含 Id 和 Ip 的JSON**************************************/
hikvision_proto.prototype.addListenDevice = function(info) {
    var self = this;
    console.log("\x1b[33m addListenDevice tongan  %s : %s\x1b[0m", info.Ip, info.Port);
    if (!info) {
        return false
    }
    if (info.Id && info.Ip) {
        info.fsm = {};
        info.fsm.recvs = [];
        //info.fsm.sendFlag = true;
        info.fsm.sends = [];
        this.systemDeviceList.push(info);
        // console.log('info:',info);

        var queryOption={};
        queryOption.socket = self.socket;
        queryOption.port = info.Port;
        queryOption.ip = info.Ip;

        var qs = new queryReportStatus(queryOption);
        return true;
    }
    return false;
};
module.exports = hikvision_proto;
