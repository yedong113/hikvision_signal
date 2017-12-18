var util = require('util');
var EventEmitter = require('events').EventEmitter;
var devicesSource = require('./devicesSourceFromDB.js');
var thenjs = require('thenjs');
var config = require('./config_hikSignal.js');
//var hklsdkenv = require('./HikLight');//海康SDKnode封装
var xml2Json = require('xml2json');
var getHikVisionErrorCode = require('./hikVisionErrCode.js');
var configData = require('./hikVisionTestData.js');

var kmlc2hikvision = require('./kmlc2hikvision.js');



function hikVisionSdk_protocol(_options){
    var self = this;

    var deviceList=[];
    
    //console.log(configData);


    self.fsm={};


    //this.hklsdk = hklsdkenv;

    self.fsm={};
    setTimeout(function() {
        self.emit('open', option);
    }, 0);
    
    setTimeout(function() {
        self.emit('close', option);
        var xmlRes='<?xml version="1.0"?><xmlRoot><Parameter><End><Flag>$msgCode</Flag></End></Parameter></xmlRoot>';
        for(var i=0;i<=54;i++){
            var result =  xmlRes.replace('$msgCode',i);
            //console.log(result);
            //self.emit('parsePhaseSettingResult',null,result);
        }
    }, 2000);
    
    this.on('newListener', function(listener) {
        console.log('Event Listener: ' + listener);
    });

    this.on('open', function(listener) {
        console.log('Event open: ' + listener);
    });

    this.on('close', function() {
        console.log('Event close: ');
    });

  
    this.on('parsePhaseSettingResult',function(param,resXml){
        this.parsePhaseSettingResult(param,resXml);
    });
    this.on('parseSequenceSettingResult',function(param,resXml){
        this.parseSequenceSettingResult(param,resXml);
    });
    this.on('parseChannelSettingResult',function(param,resXml){
        this.parseChannelSettingResult(param,resXml);
    });
    this.on('parsePatternSettingResult',function(param,resXml){
        this.parsePatternSettingResult(param,resXml);
    });
    this.on('parseActionSettingResult',function(param,resXml){
        this.parseActionSettingResult(param,resXml);
    });
    this.on('parseDayplanSettingResult',function(param,resXml){
        this.parseDayplanSettingResult(param,resXml);
    });
    this.on('parseScheduleSettingResult',function(param,resXml){
        this.parseScheduleSettingResult(param,resXml);
    });

    /*
    var lc2hik = new kmlc2hikvision(configData,function(res){
        //console.log(res);
        self.configParameter(res,function(result){
            console.log(result);
        });
    });*/
//<?xml version="1.0"?><xmlRoot><Parameter><End><Flag>0</Flag></End></Parameter></xmlRoot>
}

hikVisionSdk_protocol.prototype.start  = function(){
    var _this = this;
    _this.initSdkEnvironment(function(err){
        if(err){
            console.log(err);
        }
    });
    this.devicesSource = new devicesSource({
        host: config.mysql.host,
        user: config.mysql.user,
        pwd: config.mysql.pwd,
        database: config.mysql.database
    });
    thenjs(function(cont){
        this.devicesSource.getDeviceList(function(list){
            _this.deviceList=list;
            cont(null,null);
        });
    })
    .then(function(cont,result){

    })
    .fin(function(cont,err,result){

    });
}

//初始化SDK环境，只初始化一次
hikVisionSdk_protocol.prototype.initSdkEnvironment = function(callback){
    var _this = this;
    var res;
    //res = _this.hklsdk.HikAscInitalize('', 'ENV', 'NTCIP');
    console.log('initHikLinghtSDK ret=%d',res);
    callback(res);
    return res;
}

/**
 * 
 * @param {*} input 
 * @param {*} callback 返回 param和接口返回的xml结果 
 */
hikVisionSdk_protocol.prototype.settingPatameter = function(input,callback){
    var _this = this;
    //调用接口的设置参数函数设置参数 
    var xmlOut='<?xml version="1.0"?><xmlRoot><Parameter><End><Flag>0</Flag></End></Parameter></xmlRoot>';
    callback(xmlOut);
}

hikVisionSdk_protocol.prototype.configParameter = function(param,callback){
    var _this=this;
    _this.fsm.callback=callback;
    console.log('开始配置海康信号机参数');
    console.log('第一步:配置相位',param.phaseInfos);
    _this.settingPatameter(param.phaseInfos,function(xmlOut){
        _this.emit('parsePhaseSettingResult',param,xmlOut);
    });
}


hikVisionSdk_protocol.prototype.parsePhaseSettingResult = function(param,xmlRes){
    var resJson = xml2Json.toJson(xmlRes);
    var _this = this;
    var jsonObj = JSON.parse(resJson);
    var code = jsonObj.xmlRoot.Parameter.End.Flag;
    if(code!=0){
        getHikVisionErrorCode(code,function(msg){
            _this.fsm.callback(msg);
        });
    }else{
        console.log('第二步:配置相序',param.sequenceInfos);
        _this.settingPatameter(param.sequenceInfos,function(xmlOut){
            _this.emit('parseSequenceSettingResult',param,xmlOut);
        });
    }
}




hikVisionSdk_protocol.prototype.parseSequenceSettingResult = function(param,xmlRes){
    var resJson = xml2Json.toJson(xmlRes);
    var _this = this;
    var jsonObj = JSON.parse(resJson);
    var code = jsonObj.xmlRoot.Parameter.End.Flag;
    if(code!=0){
        getHikVisionErrorCode(code,function(msg){
            _this.fsm.callback(msg);
        });
    }else{
        console.log('第三步:配置通道',param.channelInfos);
        _this.settingPatameter(param.channelInfos,function(xmlOut){
            _this.emit('parseChannelSettingResult',param,xmlOut);
        });
    }
}


hikVisionSdk_protocol.prototype.parseChannelSettingResult = function(param,xmlRes){
    var resJson = xml2Json.toJson(xmlRes);
    var _this = this;
    var jsonObj = JSON.parse(resJson);
    var code = jsonObj.xmlRoot.Parameter.End.Flag;
    if(code!=0){
        getHikVisionErrorCode(code,function(msg){
            _this.fsm.callback(msg);
        });
    }else{
        console.log('第四步:配置方案',param.patternInfos);
        _this.settingPatameter(param.patternInfos,function(xmlOut){
            _this.emit('parsePatternSettingResult',param,xmlOut);
        });
    }
}

hikVisionSdk_protocol.prototype.parsePatternSettingResult = function(param,xmlRes){
    var resJson = xml2Json.toJson(xmlRes);
    var _this = this;
    var jsonObj = JSON.parse(resJson);
    var code = jsonObj.xmlRoot.Parameter.End.Flag;
    if(code!=0){
        getHikVisionErrorCode(code,function(msg){
            _this.fsm.callback(msg);
        });
    }else{
        _this.settingPatameter(param.actionInfos,function(xmlOut){
            _this.emit('parseActionSettingResult',param,xmlOut);
        });
    }
}


hikVisionSdk_protocol.prototype.parseActionSettingResult = function(param,xmlRes){
    var resJson = xml2Json.toJson(xmlRes);
    var _this = this;
    var jsonObj = JSON.parse(resJson);
    var code = jsonObj.xmlRoot.Parameter.End.Flag;
    if(code!=0){
        getHikVisionErrorCode(code,function(msg){
            _this.fsm.callback(msg);
        });
    }else{
        _this.settingPatameter(param.dayPlayInfos,function(xmlOut){
            _this.emit('parseDayplanSettingResult',param,xmlOut);
        });
    }
}

hikVisionSdk_protocol.prototype.parseDayplanSettingResult = function(param,xmlRes){
    var resJson = xml2Json.toJson(xmlRes);
    var _this = this;
    var jsonObj = JSON.parse(resJson);
    var code = jsonObj.xmlRoot.Parameter.End.Flag;
    if(code!=0){
        getHikVisionErrorCode(code,function(msg){
            _this.fsm.callback(msg);
        });
    }else{
        _this.settingPatameter(param.dayPlayInfos,function(xmlOut){
            _this.emit('parseScheduleSettingResult',param,xmlOut);
        });
    }
}

hikVisionSdk_protocol.prototype.parseScheduleSettingResult = function(param,xmlRes){
    var resJson = xml2Json.toJson(xmlRes);
    var _this = this;
    var jsonObj = JSON.parse(resJson);
    var code = jsonObj.xmlRoot.Parameter.End.Flag;
    if(code!=0){
        getHikVisionErrorCode(code,function(msg){
            _this.fsm.callback(msg);
        });
    }else{
        //设置成功
//        console.log('配置参数成功');
        _this.fsm.callback('配置参数成功');
    }
}


util.inherits(hikVisionSdk_protocol, EventEmitter);


var option={
    freq: '80.16',
    name: 'Rock N Roll Radio',
};

var aaa = new hikVisionSdk_protocol (option);


//module.exports = hikVisionSdk_protocol;