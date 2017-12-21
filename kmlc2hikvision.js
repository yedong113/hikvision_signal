var channelConfig = require('./channelConfig.js')
var pad = require('./pad.js');
var XMLWriter = require('xml-writer');
function kmlc2hikvision(data,callback){
    var _this = this;
    _this.DeviceId = data.Id;
    console.log('*************V1 is********************');
    _this.ScheduleTable = []; /*时基表*/
    _this.PeriodTable = []; /*时段表*/
    _this.SchemeTable = []; /*方案表*/
    _this.StageTable = []; /*阶段表*/
    _this.PhaseTable = []; /*相位表*/
    _this.PeriodTimeTable = [];
    _this.ChannelTable = [];
    _this.PhaseTable = data.PhaseTable;
    _this.SchemeTable = data.SchemeTable;
    _this.PeriodTimeTable = data.PeriodTimeTable;
    _this.ScheduleTable = data.ScheduleTable;
    for(var i=0;i<_this.PhaseTable.length;i++){
        var channelId=-1;
        for(var j=0;j<32;j++){
            var h1 = 1<<j;
            if(_this.PhaseTable[i].OutChannel&h1){
                channelId=j+1;
                break;
            }
        }
        _this.PhaseTable[i].ConflictPhase=0;
        _this.PhaseTable[i].Channel = channelId;
    }

    for(var i=0;i<_this.SchemeTable.length;i++){
        _this.SchemeTable[i].schemeId =  _this.SchemeTable[i].StageTabelId;
        _this.SchemeTable[i].Cycle = _this.SchemeTable[i].RecycleTime;
        _this.SchemeTable[i].Offset = _this.SchemeTable[i].Offset;
        _this.SchemeTable[i].Coordphase = _this.SchemeTable[i].Coordphase
        _this.SchemeTable[i].stageTableId =_this.SchemeTable[i].StageTabelId;
    }

    _this.genHikVisionConfig(function(res){
        callback(res);
    });
}


kmlc2hikvision.prototype.genChannelWithPhaseId = function(phaseId,StageData){
    var mPhaseTable = this.PhaseTable;
    var kmlc2hikChannelTable = channelConfig.kmlc2hikChannelTable;
    var phase={};
    var flag=0;
    for(var i=0;i<mPhaseTable.length;i++){
        if(mPhaseTable[i].PhaseId==phaseId){
            phase = mPhaseTable[i];
            flag++;
            break;
        }
    }
    if(flag==0){
        return 0;
    }
    var channel={};
    for(var i=0;i<kmlc2hikChannelTable.length;i++){
        var kmlc2hikChannel = kmlc2hikChannelTable[i];
        if(kmlc2hikChannel.cornor==phase.Cornor&&
            kmlc2hikChannel.laneType==phase.LaneType){
                channel.Number=kmlc2hikChannel.hikChannelId;
                channel.ControlSource = kmlc2hikChannel.phase;
                channel.ControlType = kmlc2hikChannel.controlType;
                channel.kmlcPhaseId=phaseId;
                channel.StageData=StageData;
                break;
            }
    }
    return channel;
}

function compareNumbers(a, b) {
    return a.Number - b.Number;
  }

kmlc2hikvision.prototype.genChannelWithConfig=function(StageData,PhaseBitmap){
    
    var phasebitmapB=PhaseBitmap.toString(2);
    phasebitmapB = pad(phasebitmapB,16,'0','l');    
    var channels=[];
    for(var i=phasebitmapB.length-1,j=1;i>=0;i--,j++){
        if(phasebitmapB[i]=='1'){
            var channel = this.genChannelWithPhaseId(j,StageData);
            if(channel!=0){
                channels.push(channel);
            }
        }
    }
    return channels;
}

kmlc2hikvision.prototype.isPhaseFind = function(phaseId,phaseTables){
    for(var i=0;i<phaseTables.length;i++){
        if(phaseTables[i].Number==phaseId){
            return 1;
        }
    }
    return 0;
}

kmlc2hikvision.prototype.genHikVisionConfig = function(callback){
    var _this = this;    
    var mSchemeTable=_this.SchemeTable;
    var channelTable=[];
    var phaseTables=[];
    var sequence=[];
    var splitTables=[];
    var patternTables=[];
    var actionTables=[];
    var dayPlanTables=[];
    var scheduleTables=[];
    var overLapTables = [];
    for(var i=0;i<mSchemeTable.length;i++){
        var StageDatas = mSchemeTable[i].StageData;
        for(var ii=0;ii<3;ii++){
            var parrenNumber=i*3+(ii+1);
            var parrernInfo={
                Number:i*3+(ii+1),
                CycleTime:mSchemeTable[i].RecycleTime,
                OffsetTime:mSchemeTable[i].Offset,
                SplitNumber:1,
                SequenceNumber:1,
                KmlcParrenNumber:mSchemeTable[i].StageTabelId
            };
            var mm = ii%3;
            var pnumber = mm==0?parrenNumber:0;
            var AuxillaryFunction=mm==0?1:0;
            var SpecialFunction=mm==0?1:0;
            var actionInfo = {
                Number:i*3+(ii+1),
                Pattern:pnumber,
                AuxillaryFunction:AuxillaryFunction,
                SpecialFunction:SpecialFunction
            };
            actionTables.push(actionInfo);
            patternTables.push(parrernInfo);
    
        }
        for(var j=0;j<StageDatas.length;j++){
            var StageData = StageDatas[j];
            var tmpChannels = _this.genChannelWithConfig(StageData,StageData.PhaseBitmap>>1);
            channelTable = channelTable.concat(tmpChannels);
        }
        break;
    }

    
    for(var i=0;i<channelTable.length;i++){
        var channelInfo = channelTable[i];
        var StageData=channelInfo.StageData;
        phaseInfo={};
        var hikversionphaseid = channelInfo.ControlSource;
        var result=this.isPhaseFind(hikversionphaseid,phaseTables);
        if(result==0){
            phaseTables.push({
                Number:hikversionphaseid,
                PhaseWalk:0,
                PedestrianClear:StageData.GreenFlash,
                MinimumGreen:StageData.Green,
                Passage:3,
                Maximum1:StageData.Green+StageData.GreenFlash,
                Maximum2:StageData.Green+StageData.GreenFlash>50?StageData.Green+StageData.GreenFlash:50,
                YellowChange:StageData.Yellow,
                RedClear:StageData.Red,
                RedRevert:0,
                Startup:0,
                Options:8705,
                Ring:1,
                Concurrency:''
            });
        }
    }


    channelTable.sort(compareNumbers);
    phaseTables.sort(compareNumbers);
    sequence.push({
        SequenceNumber:1,
        RingNumber:1,
        PhaseSequence:'1 2 3 4'
    });
/*
    for(var i=0;i<16;i++){
        if(i%4==0){
            sequence.push({
                SequenceNumber:1,
                RingNumber:i+1,
                PhaseSequence:'1 2 3 4'
            });
        }
        else{
            sequence.push({
                SequenceNumber:1,
                RingNumber:i+1,
                PhaseSequence:''
            });
        }
    }

    
    var len=phaseTables.length;
    for(var i=len;i<16;i++){
        phaseTables.push({ Number: i+1,
            PhaseWalk: 0,
            PedestrianClear: 0,
            MinimumGreen: 0,
            Passage: 0,
            Maximum1: 0,
            Maximum2: 0,
            YellowChange: 0,
            RedClear: 0,
            RedRevert: 0,
            Startup: 0,
            Options: 0,
            Ring: 0,
            Concurrency: '' 
        });
    }*/

    for(var i=0;i<phaseTables.length;i++){
        splitTables.push({
            SplitNumber:1,
            PhaseNumber:phaseTables[i].Number,
            Time:phaseTables[i].Maximum1+phaseTables[i].YellowChange+phaseTables[i].RedClear,
            Mode:0,
            CoordPhase:0
        });
    }
    /*
    for(var i=actionTables.length;i<16;i++){
        var actionInfo={ Number: i+1,
                Pattern: 0,
                AuxillaryFunction: 0,
                SpecialFunction: 0 };
        actionTables.push(actionInfo);
    }

    for(var i=patternTables.length;i<16;i++){
        var pinfo={ Number: i+1,
                CycleTime: 0,
                OffsetTime: 0,
                SplitNumber: 0,
                SequenceNumber: 0,
                KmlcParrenNumber:0
            };
        patternTables.push(pinfo);
    }*/
    
    for(var i=0;i<_this.PeriodTimeTable.length;i++){
        var PeriodTime = _this.PeriodTimeTable[i];
        for(var j=0;j<PeriodTime.TimeIntervalInfo.length;j++){
            var TimeIntervalInfo=PeriodTime.TimeIntervalInfo[j];
            var dayplaninfo={};
            dayplaninfo.DayPlanNumber=1;
            dayplaninfo.PlanNumber=j+1;
            dayplaninfo.Hour=TimeIntervalInfo.StartHour;
            dayplaninfo.Minute=TimeIntervalInfo.StartMinute;
            dayplaninfo.ActionNumber = _this.getActionNumber(TimeIntervalInfo.SchemeTabelId,patternTables,actionTables);
            if(dayplaninfo.ActionNumber!=0){
                dayPlanTables.push(dayplaninfo);
            }
        }
    }

    scheduleTables = _this.getScheduleInfos(_this.ScheduleTable);
    /*
    for(var i=dayPlanTables.length;i<16;i++){
        var dayplaninfo={};
        dayplaninfo.DayPlanNumber=1;
        dayplaninfo.PlanNumber=i+1;
        dayplaninfo.Hour=0;
        dayplaninfo.Minute=0;
        dayplaninfo.ActionNumber = 0;
        dayPlanTables.push(dayplaninfo); 
    }
    
    for(var i=scheduleTables.length;i<16;i++){
        scheduleTables.push({
            Number:i+1,
            Month:0,
            Day:0,
            Date:0,
            DayPlan:1
        });
    }*/
    for(var i=0;i<16;i++){
        overLapTables.push({
            Number:0,
            TrailGreen:0,
            TrailRed:0,
            TrailYellow:0,
            IncludedPhases:'',
            ModifierPhases:''
        });
    }
    console.log('-------------------------------');
    var res={};
    res.DeviceId = _this.DeviceId;//DeviceId
    //res.phaseInfos=_this.genPhaseXml(phaseTables);

    //只配置相位、相序、绿信比、通道、方案、动作、时段、调度和写flash
    res.startInfos = _this.genStartXml(0b10000011111001110);
    res.endInfos = _this.genEndXml();

    res.phaseInfos={
        data:_this.genPhaseXml(phaseTables)
    };
    res.sequenceInfos ={
        data:_this.genSequenceXml(sequence)
    };
    res.channelInfos = {
        data:_this.genChannelXml(channelTable)
    };
    res.patternInfos = {
        data:_this.genPatternXml(patternTables)
    };

    res.actionInfos = {
        data:_this.genActionXml(actionTables)
    };

    res.dayPlayInfos = {
        data:_this.genDayplayXml(dayPlanTables)
    };

    res.scheduleInfos = {
        data:_this.genScheduleXml(scheduleTables)
    };
    res.splitInfos = {
        begin:_this.genStartXml(0b10000),//
        data:_this.genSplitXml(splitTables),
        end:res.endInfos
    };
    callback(res);
}

/**
 * 根据SchemeTabelId查找actionnummber，先从patternTables照到对应的方案号，在从actionTables重查找actionnumber
 * @param {*} SchemeTabelId 
 * @param {*} patternTables 
 * @param {*} actionTables 
 */
kmlc2hikvision.prototype.getActionNumber = function(SchemeTabelId,patternTables,actionTables){
    var ationNumber=0;
    var patterNumber=0;
    var flag=0;
    for(var i=0;i<patternTables.length;i++){
        if(SchemeTabelId==patternTables[i].KmlcParrenNumber){
            patterNumber=patternTables[i].Number;
            flag++;
            break;
        }
    }
    if(flag==0){
        return 0;
    }
    for(var i=0;i<actionTables.length;i++){
        if(patterNumber==actionTables[i].Pattern){
            ationNumber=actionTables[i].Number;
        }
    }
    return ationNumber;
}


kmlc2hikvision.prototype.getScheduleInfos=function(ScheduleTables) {
    var len = ScheduleTables.length;
    var scheduleInfos = [];
    var subScheduleNumber = 1;
    for (var i = 0; i < len; i++) {
        var scheduleInfo = ScheduleTables[i];
        var scheduleNumber = scheduleInfo.PlaneId;
        var week = scheduleInfo.Week;
        var weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        var day=0;
        var SchemeTabelId=0;
        for (var j = 1; j <= 7; j++) {
            if(week[weeks[j-1]]!=0){
                day = day|1<<(j);
                SchemeTabelId=week[weeks[j-1]];
            }
        }
        var resScheduleInfo = {
            Number: subScheduleNumber++,
            Month: 0b1111111111110,
            Day: day,
            Date: 0,
            DayPlan: SchemeTabelId
        };
        scheduleInfos.push(resScheduleInfo);
    }
    return scheduleInfos;
}


/**
 * 生成相位XML文件
 * @param {*} phaseTables 
 */
kmlc2hikvision.prototype.genPhaseXml=function(phaseTables) {
    var xw = new XMLWriter;
    xw.startDocument('1.0');
    xw.startElement('xmlRoot')
        .startElement('Parameter')
        .writeAttribute('Operate', 'Set');
    
    xw.startElement('Phase');
    for(var i=0;i<phaseTables.length;i++){
        var phaseInfo = phaseTables[i];
        xw.startElement('Phase'+phaseInfo.Number);
        xw.writeElement("Number", phaseInfo.Number);
        xw.writeElement("PhaseWalk", phaseInfo.PhaseWalk);
        xw.writeElement("PedestrianClear", phaseInfo.PedestrianClear);
        xw.writeElement("MinimumGreen", phaseInfo.MinimumGreen);
        xw.writeElement("Passage", phaseInfo.Passage);
        xw.writeElement("Maximum1", phaseInfo.Maximum1);
        xw.writeElement("Maximum2", phaseInfo.Maximum2);
        xw.writeElement("YellowChange", phaseInfo.YellowChange);
        xw.writeElement("RedClear", phaseInfo.RedClear);
        xw.writeElement("RedRevert", phaseInfo.RedRevert);
        xw.writeElement("Startup", phaseInfo.Startup);
        xw.writeElement("Options", phaseInfo.Options);
        xw.writeElement("Ring", phaseInfo.Ring);
        xw.writeElement("Concurrency", phaseInfo.Concurrency);
        xw.endElement();
    }
    xw.endElement();
    var str=xw.toString();
    str = str.replace(/[\r\n]/g,"")
    return str;
}



kmlc2hikvision.prototype.genSequenceXml=function(sequence){
    var xw = new XMLWriter;
    xw.startDocument('1.0');
    xw.startElement('xmlRoot')
        .startElement('Parameter')
        .writeAttribute('Operate', 'Set');
    
    xw.startElement('Sequence');
    xw.startElement('Sequence1');
    for(var i=0;i<sequence.length;i++){
        var sequenceInfo = sequence[i];
        xw.startElement('Ring'+sequenceInfo.SequenceNumber);
        xw.writeElement("SequenceNumber", sequenceInfo.SequenceNumber);
        xw.writeElement("RingNumber", sequenceInfo.RingNumber);
        xw.writeElement("PhaseSequence", sequenceInfo.PhaseSequence);
        xw.endElement();
    }
    xw.endElement();
    xw.endElement();
    var str=xw.toString();
    str = str.replace(/[\r\n]/g,"")
    return str;
}


kmlc2hikvision.prototype.genOverLapXml=function(overLapTables){
    var xw = new XMLWriter;
    xw.startDocument('1.0');
    xw.startElement('xmlRoot')
        .startElement('Parameter')
        .writeAttribute('Operate', 'Set');
    
    xw.startElement('OverLap');
    for(var i=0;i<overLapTables.length;i++){
        var overLapInfo = overLapTables[i];
        xw.startElement('OverLap'+overLapInfo.Number);
        xw.writeElement("Number", overLapInfo.Number);
        xw.writeElement("TrailGreen", overLapInfo.TrailGreen);
        xw.writeElement("TrailRed", overLapInfo.TrailRed);
        xw.writeElement("TrailYellow", overLapInfo.TrailYellow);
        xw.writeElement("IncludedPhases", overLapInfo.IncludedPhases);
        xw.writeElement("ModifierPhases", overLapInfo.ModifierPhases);
        xw.endElement();
    }
    xw.endElement();
    var str=xw.toString();
    str = str.replace(/[\r\n]/g,"")
    return str;
}


kmlc2hikvision.prototype.genChannelXml = function(channelTable){
    var xw = new XMLWriter;
    xw.startDocument('1.0');
    xw.startElement('xmlRoot')
        .startElement('Parameter')
        .writeAttribute('Operate', 'Set');

    xw.startElement('Channel');
    for(var i=0;i<channelTable.length;i++){
        var channelInfo = channelTable[i];
        xw.startElement('Channel'+channelInfo.Number);
        xw.writeElement("Number", channelInfo.Number);
        xw.writeElement("ControlSource", channelInfo.ControlSource);
        xw.writeElement("ControlType", channelInfo.ControlType);
        xw.endElement();
    }
    xw.endElement();
    var str=xw.toString();
    str = str.replace(/[\r\n]/g,"")
    return str;
}



kmlc2hikvision.prototype.genSplitXml=function(splitTables){
    var xw = new XMLWriter;
    xw.startDocument('1.0');
    xw.startElement('xmlRoot')
        .startElement('Parameter')
        .writeAttribute('Operate', 'Set');

    xw.startElement('Split');
    xw.startElement('Split1');
    for(var i=0;i<splitTables.length;i++){
        var splitInfo = splitTables[i];
        xw.startElement('Phase'+splitInfo.PhaseNumber);
        xw.writeElement("SplitNumber", splitInfo.SplitNumber);
        xw.writeElement("PhaseNumber", splitInfo.PhaseNumber);
        xw.writeElement("Time", splitInfo.Time);
        xw.writeElement("Mode", splitInfo.Mode);
        xw.writeElement("CoordPhase", splitInfo.CoordPhase);
        xw.endElement();
    }
    xw.endElement();
    xw.endElement();
    var str=xw.toString();
    str = str.replace(/[\r\n]/g,"")
    return str;
}


kmlc2hikvision.prototype.genPatternXml=function(patternTables){
    var xw = new XMLWriter;
    xw.startDocument('1.0');
    xw.startElement('xmlRoot')
        .startElement('Parameter')
        .writeAttribute('Operate', 'Set');

    xw.startElement('Pattern');
    for(var i=0;i<patternTables.length;i++){
        var patternInfo = patternTables[i];
        xw.startElement('Pattern'+patternInfo.Number);
        xw.writeElement("Number", patternInfo.Number);
        xw.writeElement("CycleTime", patternInfo.CycleTime);
        xw.writeElement("SplitNumber", patternInfo.SplitNumber);
        xw.writeElement("SequenceNumber", patternInfo.SequenceNumber);
        xw.endElement();
    }
    xw.endElement();
    var str=xw.toString();
    str = str.replace(/[\r\n]/g,"")
    return str;
}




kmlc2hikvision.prototype.genActionXml = function(actionTables){
    var xw = new XMLWriter;
    xw.startDocument('1.0');
    xw.startElement('xmlRoot')
        .startElement('Parameter')
        .writeAttribute('Operate', 'Set');

    xw.startElement('Action');
    for(var i=0;i<actionTables.length;i++){
        var actionInfo = actionTables[i];
        xw.startElement('Action'+actionInfo.Number);
        xw.writeElement("Number", actionInfo.Number);
        xw.writeElement("Pattern", actionInfo.Pattern);
        xw.writeElement("AuxillaryFunction", actionInfo.AuxillaryFunction);
        xw.writeElement("SpecialFunction", actionInfo.SpecialFunction);
        xw.endElement();
    }
    xw.endElement();
    var str=xw.toString();
    str = str.replace(/[\r\n]/g,"")
    return str;
}



kmlc2hikvision.prototype.genDayplayXml = function(dayPlanTables){
    var xw = new XMLWriter;
    xw.startDocument('1.0');
    xw.startElement('xmlRoot')
        .startElement('Parameter')
        .writeAttribute('Operate', 'Set');

    xw.startElement('DayPlan');
    xw.startElement('DayPlan1');
    for(var i=0;i<dayPlanTables.length;i++){
        var dayplaninfo = dayPlanTables[i];
        xw.startElement('Plan'+(i+1));
        xw.writeElement("DayPlanNumber", dayplaninfo.DayPlanNumber);
        xw.writeElement("PlanNumber", dayplaninfo.PlanNumber);
        xw.writeElement("Hour", dayplaninfo.Hour);
        xw.writeElement("Minute", dayplaninfo.Minute);
        xw.writeElement("ActionNumber", dayplaninfo.ActionNumber);
        xw.endElement();
    }
    xw.endElement();
    xw.endElement();
    var str=xw.toString();
    str = str.replace(/[\r\n]/g,"")
    return str;
}


kmlc2hikvision.prototype.genScheduleXml = function(scheduleTables){
    var xw = new XMLWriter;
    xw.startDocument('1.0');
    xw.startElement('xmlRoot')
        .startElement('Parameter')
        .writeAttribute('Operate', 'Set');
    xw.startElement('Schedule');
    for(var i=0;i<scheduleTables.length;i++){
        var scheduleinfo = scheduleTables[i];
        xw.startElement("Schedule"+ scheduleinfo.Number);
        xw.writeElement("Number", scheduleinfo.Number);
        xw.writeElement("Month", scheduleinfo.Month);
        xw.writeElement("Day", scheduleinfo.Day);
        xw.writeElement("Date", scheduleinfo.Date);
        xw.writeElement("DayPlan", scheduleinfo.DayPlan);
        xw.endElement();
    }
    xw.endElement();
    var str=xw.toString();
    str = str.replace(/[\r\n]/g,"")
    return str;
}

kmlc2hikvision.prototype.genStartXml = function(flag){
    var xw = new XMLWriter;
    xw.startDocument('1.0');
    xw.startElement('xmlRoot')
        .startElement('Parameter')
        .writeAttribute('Operate', 'Set');

    xw.startElement('Start');
    xw.writeElement("Flag", flag);
    xw.endElement();
    var str=xw.toString();
    str = str.replace(/[\r\n]/g,"")
    return str;
}

kmlc2hikvision.prototype.genEndXml = function(){
    var flag=0;
    var xw = new XMLWriter;
    xw.startDocument('1.0');
    xw.startElement('xmlRoot')
        .startElement('Parameter')
        .writeAttribute('Operate', 'Set');

    xw.startElement('End');
    xw.writeElement("Flag", flag);
    xw.endElement();
    var str=xw.toString();
    str = str.replace(/[\r\n]/g,"")
    return str;
}


module.exports = kmlc2hikvision;