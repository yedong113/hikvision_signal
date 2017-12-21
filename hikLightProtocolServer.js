var util = require('util');
var EventEmitter = require('events').EventEmitter;
var devicesSource = require('./devicesSourceFromDB.js');
var thenjs = require('thenjs');
var config = require('./config_hikSignal.js');
var hklsdkenv = require('./HikLight');//海康SDKnode封装
var xml2Json = require('xml2json');
var getHikVisionErrorCode = require('./hikVisionErrCode.js');
var getSetMsgTransCode = require('./hikVisionErrCode.js');
var configData = require('./hikVisionTestData.js');
var kmlc2hikvision = require('./kmlc2hikvision.js');
var pad = require('./pad.js');
var channelConfig = require('./channelConfig.js');
//var kafka = require('kafka-node');
var kafkaStatusReport = require('./kafkaStatusReportX86.js');

function hikLightProtocolServer(_options){
    var self = this;
    var deviceList=[];
    //console.log(configData);
    self.fsm={};
    this.hklsdk = hklsdkenv;
    setTimeout(function() {
    }, 0);
    
    setTimeout(function() {
        self.emit('wait', option);
        var xmlRes='<?xml version="1.0"?><xmlRoot><Parameter><End><Flag>$msgCode</Flag></End></Parameter></xmlRoot>';
        for(var i=0;i<=54;i++){
            var result =  xmlRes.replace('$msgCode',i);
            //console.log(result);
            //self.emit('parsePhaseSettingResult',null,result);
        }
    }, 10000);
    this.on('newListener', function(listener) {
        console.log('Event Listener: ' + listener);
    });
    this.on('wait',function(){
        setTimeout(function() {
            self.emit('wait', option);
        }, 10000);
    });
    this.on('queryStatus',function(deviceId,lAscId){
        console.log('queryStatus on ',deviceId,lAscId);
        this.queryStatus(deviceId,lAscId);
    });
    this.on('parseStartSettingResult',function(param,resCode,resXml){
        console.log(resCode,outXml);
        this.parseStartSettingResult(param,resCode,resXml);
    });
  
    this.on('parsePhaseSettingResult',function(param,resCode,resXml){
        self.parseDayplanSettingResult(param,resCode,resXml);
    });

    this.on('parseSequenceSettingResult',function(param,resCode,resXml){
        this.parseSequenceSettingResult(param,resCode,resXml);
    });
    this.on('parseChannelSettingResult',function(param,resCode,resXml){
        this.parseChannelSettingResult(param,resCode,resXml);
    });

    this.on('parseSplitSettingResult',function(param,resCode,resXml){
        this.parseSplitSettingResult(param,resCode,resXml);
    });
    this.on('parsePatternSettingResult',function(param,resCode,resXml){
        this.parsePatternSettingResult(param,resCode,resXml);
    });
    this.on('parseActionSettingResult',function(param,resCode,resXml){
        this.parseActionSettingResult(param,resCode,resXml);
    });
    this.on('parseDayplanSettingResult',function(param,resCode,resXml){
        this.parseDayplanSettingResult(param,resCode,resXml);
    });
    this.on('parseScheduleSettingResult',function(param,resCode,resXml){
        this.parseScheduleSettingResult(param,resCode,resXml);
    });
    this.on('parseEndSettingResult',function(resCode,resXml){
        this.parseEndSettingResult(resCode,resXml);
    });
    this.on('getPhaseInfos',function(param){
        this.getPhaseInfos(param);
    });


    self.start();
    /*
    var lc2hik = new kmlc2hikvision(configData,function(res){
        //console.log(res);
        self.configParameter(res,function(result){
            console.log(result);
        });
    });
    */
//<?xml version="1.0"?><xmlRoot><Parameter><End><Flag>0</Flag></End></Parameter></xmlRoot>
}

hikLightProtocolServer.prototype.getPhaseInfos = function(param){
    var _this = this;
    var input='<?xml version="1.0"?><xmlRoot><Status Operate="Get"><Channel></Channel></Status></xmlRoot>';
    console.log(input);
    _this.hklsdk.HikAscMsgTrans(param.lAscId,input,function(res,xmlOut){
        console.log('res=',res,xmlOut);
    });
}

hikLightProtocolServer.prototype.getParameter = function(param,input){
    var _this = this;
    //var input='<?xml version="1.0"?><xmlRoot><Status Operate="Get"><Channel></Channel></Status></xmlRoot>';
    console.log(input);
    _this.hklsdk.HikAscMsgTrans(param.lAscId,input,function(res,xmlOut){
        console.log('res=',res,xmlOut);
    });
}

hikLightProtocolServer.prototype.parseChannelStatus = function(deviceId,xmlStatus,callback){
    console.log(xml2Json.toJson(xmlStatus));
    var data = JSON.parse(xml2Json.toJson(xmlStatus));
    var dataRow = {};
    dataRow.Id = deviceId;
    dataRow.CtrlMode = 0; //
    dataRow.PlanID = 0; //显示当前执行的方案号
    dataRow.CycleTime = 0; //周期时间
    dataRow.StepTotal = 0; //总步数
    dataRow.StepNow = 0; //当前步序号
    dataRow.StepLen = 0; //当前步的时长(单位秒)
    dataRow.StepSurplusTime = 0; //当前步的剩余时间(单位秒)
    dataRow.MinGreenTime = 0; //最小绿
    dataRow.MaxGreenTime = 0; //最大绿
    console.log(data.xmlRoot.Status.Channel.Yellow);
    var redChannelStatus = parseInt(data.xmlRoot.Status.Channel.Red);
    
    var greenChannelStatus = parseInt(data.xmlRoot.Status.Channel.Green);
    var yellowChannelStatus = parseInt(data.xmlRoot.Status.Channel.Yellow);
    console.log(data);
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
    dataRow.CrossStatusInfo = CrossStatusInfo;
    console.log(dataRow);
    callback(dataRow);
}


hikLightProtocolServer.prototype.queryStatus = function(deviceId,lAscId){
    var _this = this;
    var input='<?xml version="1.0"?><xmlRoot><Status Operate="Get"><Channel></Channel></Status></xmlRoot>';
    _this.hklsdk.HikAscMsgTrans(lAscId,input,function(res,xmlOut){
        console.log('deviceId=',deviceId,'res=',res,xmlOut);
        _this.parseChannelStatus(deviceId,xmlOut,function (data) {
            _this.kafkaReportStatus.uploadSignalStatus(data,function (err) {
                console.log(err);
            });
        });
    });
    setTimeout(function() {
        _this.emit('queryStatus', deviceId,lAscId);
    }, 2000);

}


hikLightProtocolServer.prototype.start  = function(){
    var _this = this;
    _this.initSdkEnvironment(function(err){
        if(err){
            console.log(err);
        }
    });
    _this.devicesSource = new devicesSource({
        host: config.mysql.host,
        user: config.mysql.user,
        pwd: config.mysql.pwd,
        database: config.mysql.database
    });
    
    thenjs(function(cont){
        _this.devicesSource.getDeviceList(function(list){
            _this.deviceList=list;
            console.log(_this.deviceList);
            cont(null,null);
        });
    })
    .then(function(cont,result){
        console.log('开始登录信号机');
        _this.connectDevice();
        cont(null,null);
    })
    .fin(function(cont,err,result){

    });

    _this.kafkaReportStatus = new kafkaStatusReport();
}

//初始化SDK环境，只初始化一次
hikLightProtocolServer.prototype.initSdkEnvironment = function(callback){
    var _this = this;
    var res=0;
    res = _this.hklsdk.HikAscInitalize('', 'ENV', 'NTCIP');
    console.log('initHikLinghtSDK ret=%d',res);
    callback(res);
    return res;
}

hikLightProtocolServer.prototype.connectDevice = function(){
    var _this = this;
    for(var i=0;i<_this.deviceList.length;i++){
        var sip = _this.deviceList[i].Ip;
        var port = _this.deviceList[i].Port;
        console.log(sip,port);
        var lAscId=_this.hklsdk.HikAscLogin(sip,port);
        if(lAscId>0){
            _this.deviceList[i].lAscId=lAscId;
            console.log('登录信号机:',sip,'成功 lAscId=',lAscId);
            console.log(_this.deviceList[i]);
            /*
            var lc2hik = new kmlc2hikvision(configData,function(res){
                _this.configParameter(res,function(result){
                    console.log(result);
                });
            });
            */
            //_this.emit('getPhaseInfos',_this.deviceList[i]);
            //_this.emit('queryStatus', _this.deviceList[i].Id,_this.deviceList[i].lAscId);
        }
        else{
            console.log('登录信号机:',sip,'失败,',lAscId);
        }
    }
}


hikLightProtocolServer.prototype.startSettingParameter = function(lAscId,input,callback){
    var _this = this;
    console.log('startSettingParameter=',lAscId,input);
    _this.hklsdk.HikAscMsgTrans(lAscId,input,function(resCode,outXml){
        callback(resCode,outXml);
    });
}

hikLightProtocolServer.prototype.endSettingParameter = function(lAscId,input,callback){
    var _this = this;
    console.log(lAscId,input);
    _this.hklsdk.HikAscMsgTrans(lAscId,input,function(resCode,outXml){
        callback(resCode,outXml);
    });
}

/**
 * 
 * @param {*} input 
 * @param {*} callback 返回 param和接口返回的xml结果 
 */
hikLightProtocolServer.prototype.settingPatameter = function(lAscId,input,callback){
    var _this = this;
    //调用接口的设置参数函数设置参数 
    //console.log(input);
    _this.hklsdk.HikAscMsgTrans(lAscId,input.data,function(resCode,outXml){
        console.log('resCode=',resCode,'outXml=',outXml);
        callback(resCode,outXml);
    });
}


hikLightProtocolServer.prototype.add_task_paramer = function (param,callback) {
    var _this = this;

}


hikLightProtocolServer.prototype.getDeviceConnStatus = function (lAScId) {
    var _this = this;

}


hikLightProtocolServer.prototype.configParameter = function(param,callback){
    var _this=this;
    _this.fsm.callback=callback;
    var flag=0;
    console.log(param);
    for(var i=0;i<_this.deviceList.length;i++){
        if(param.DeviceId==_this.deviceList[i].Id){
            param.lAscId=_this.deviceList[i].lAscId;
            flag++;
            break;
        }
    }
    if(flag==0){
        callback({errCode:1,errorString:'设备不在线'});
        return;
    }
    console.log('开始配置海康信号机参数',param);
    _this.startSettingParameter(param.lAscId,param.startInfos,function(resCode,xmlOut){
        console.log(resCode,xmlOut);
        //_this.emit('parseStartSettingResult',param,resCode,xmlOut);
        _this.parseStartSettingResult(param,resCode,xmlOut);
    });
}


hikLightProtocolServer.prototype.parseStartSettingResult = function(param,resCode,outXml){
    var _this = this;
    
    if(resCode!=0){
        _this.fsm.callback({errCode:resCode,errorString:getSetMsgTransCode(resCode)});
        return;
    }
    console.log('配置相位',param.phaseInfos);
    _this.settingPatameter(param.lAscId,param.phaseInfos,function(resCode,xmlOut){
        //_this.emit('parseSequenceSettingResult',param,resCode,xmlOut);
        _this.getParameter(param,'<?xml version="1.0"?><xmlRoot><Parameter Operate="Get"><Phase></Phase></Parameter></xmlRoot>');
        //_this.settingPatameter(param.lAscId,param.sequenceInfos,function(resCode,xmlOut){
            _this.emit('parseSequenceSettingResult',param,resCode,xmlOut);
        //});
    });
}


hikLightProtocolServer.prototype.parsePhaseSettingResult = function(param,resCode,xmlRes){
    var _this = this;
    if(resCode!=0){
        _this.fsm.callback({errCode:resCode,errorString:getSetMsgTransCode(resCode)});
        return;
    }
    console.log('配置相序',param.sequenceInfos);
    _this.settingPatameter(param.lAscId,param.sequenceInfos,function(resCode,xmlOut){
        _this.emit('parseChannelSettingResult',param,resCode,xmlOut);
    });
}




hikLightProtocolServer.prototype.parseSequenceSettingResult = function(param,resCode,xmlRes){
    var _this = this;
    if(resCode!=0){
        _this.fsm.callback({errCode:resCode,errorString:getSetMsgTransCode(resCode)});
        return;
    }
    console.log('配置通道',param.channelInfos);
    _this.settingPatameter(param.lAscId,param.channelInfos,function(resCode,xmlOut){
        _this.emit('parseChannelSettingResult',param,resCode,xmlOut);
    });
}

hikLightProtocolServer.prototype.parseChannelSettingResult = function(param,resCode,xmlRes){
    var _this = this;
    if(resCode!=0){
        _this.fsm.callback({errCode:resCode,errorString:getSetMsgTransCode(resCode)});
        return;
    }
    console.log('配置绿信比',param.splitInfos);
    _this.settingPatameter(param.lAscId,param.splitInfos,function(resCode,xmlOut){
        _this.emit('parseSplitSettingResult',param,resCode,xmlOut);
    });
}



hikLightProtocolServer.prototype.parseSplitSettingResult = function(param,resCode,xmlRes){
    var _this = this;
    if(resCode!=0){
        _this.fsm.callback({errCode:resCode,errorString:getSetMsgTransCode(resCode)});
        return;
    }
    console.log('配置方案',param.patternInfos);
    _this.settingPatameter(param.lAscId,param.patternInfos,function(resCode,xmlOut){
        _this.emit('parsePatternSettingResult',param,resCode,xmlOut);
    });
}

hikLightProtocolServer.prototype.parsePatternSettingResult = function(param,resCode,xmlRes){
    var _this = this;
    if(resCode!=0){
        _this.fsm.callback({errCode:resCode,errorString:getSetMsgTransCode(resCode)});
        return;
    }
    console.log('配置动作表',param.actionInfos);
    _this.settingPatameter(param.lAscId,param.actionInfos,function(resCode,xmlOut){
        _this.emit('parseActionSettingResult',param,resCode,xmlOut);
    });
}


hikLightProtocolServer.prototype.parseActionSettingResult = function(param,resCode,xmlRes){
    var _this = this;
    if(resCode!=0){
        _this.fsm.callback({errCode:resCode,errorString:getSetMsgTransCode(resCode)});
        return;
    }
    console.log('配置时段表',param.dayPlayInfos);
    _this.settingPatameter(param.lAscId,param.dayPlayInfos,function(resCode,xmlOut){
        _this.emit('parseDayplanSettingResult',param,resCode,xmlOut);
    });
}

hikLightProtocolServer.prototype.parseDayplanSettingResult = function(param,resCode,xmlRes){
    var _this = this;
    if(resCode!=0){
        _this.fsm.callback({errCode:resCode,errorString:getSetMsgTransCode(resCode)});
        return;
    }
    console.log('配置调度计划表',param.scheduleInfos);
    _this.settingPatameter(param.lAscId,param.scheduleInfos,function(resCode,xmlOut){
        _this.emit('parseScheduleSettingResult',param,resCode,xmlOut);
    });
}

hikLightProtocolServer.prototype.parseScheduleSettingResult = function(param,resCode,xmlRes){
    var _this = this;
    if(resCode!=0){
        _this.fsm.callback({errCode:resCode,errorString:getSetMsgTransCode(resCode)});
        return;
    }
    _this.endSettingParameter(param.lAscId,param.endInfos,function(resCode,xmlRes){
        _this.emit('parseEndSettingResult',resCode,xmlOut);
    });
}


hikLightProtocolServer.prototype.parseEndSettingResult = function(resCode,xmlRes){
    var _this = this;
    if(resCode!=0){
        _this.fsm.callback({errCode:resCode,errorString:getSetMsgTransCode(resCode)});
        return;
    }
    var resJson = xml2Json.toJson(xmlRes);
    
    var jsonObj = JSON.parse(resJson);
    var code = jsonObj.xmlRoot.Parameter.End.Flag;
    if(code!=0){
        getHikVisionErrorCode(code,function(msg){
            _this.fsm.callback(msg);
        });
    }
    else{
        _this.fsm.callback('配置参数成功');
    }
}

util.inherits(hikLightProtocolServer, EventEmitter);


var option={
    freq: '80.16',
    name: 'Rock N Roll Radio',
};

//var aaa = new hikLightProtocolServer (option);


module.exports = hikLightProtocolServer;