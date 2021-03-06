hikvisionerrorcode=[
    {code:0, msgcode:'',msg:''},
    {code:1, msgcode:'ERROR_NULL_POINTER',msg:'全局指针为空'},
    {code:2, msgcode:'ERROR_SUBSCRIPT_PHASE',msg:'相位数组下标值+1与实际相位值不相同。'},
    {code:3, msgcode:'ERROR_SUBSCRIPT_PHASE_TURN',msg:'相序表的数组下标值+1与实际相序表号不相同。'},
    {code:4, msgcode:'ERROR_SUSCRIPT_PHASE_TURN_CIRCLE',msg:'相序表的环号组的下标值+1与实际环号不相同。'},
    {code:5, msgcode:'ERROR_SUBSCRIPT_GREEN_SIGNAL_RATION',msg:'绿信比表的数组下标值+1与实际绿信比表号不相同。'},
    {code:6, msgcode:'ERROR_SUBSCRIPT_GREEN_SIGNAL_RATION_PHASE',msg:'绿信比表的相位数组下标值+1与实际相位号不相同。'},
    {code:7, msgcode:'ERROR_SUBSCRIPT_CHANNEL',msg:'通道表的数组下标值+1与实际通道号不相同。'},
    {code:8, msgcode:'ERROR_SUBSCRIPT_SCHEME',msg:'方案表的数组下标值+1与实际方案号不相同。'},
    {code:9, msgcode:'ERROR_SUBSCRIPT_ACTION',msg:'动作表的数组下标值+1与实际动作号不相同。'},
    {code:10,msgcode:'ERROR_SUBSCRIPT_TIMEINTERVAL',msg:'时段表的数组下标值+1与实际时段表号不相同。'},
    {code:11,msgcode:'ERROR_SUBSCRIPT_TIMEINTERVAL_TIME',msg:'动作表的时段数组下标值+1与实际时段号不相同。'},
    {code:12,msgcode:'ERROR_SUBSCRIPT_SCHEDULE',msg:'调度表的数组下标值+1与调度表号不相同。'},
    {code:13,msgcode:'ERROR_SUBSCRIPT_FOLLOW_PHASE',msg:'跟随相位表的数组下标值+1与实际跟随相位号不相同。'},
    {code:14,msgcode:'ERROR_SAME_CIRCLE_CONCURRENT_PHASE',msg:'并发相位表中相位号存在于并发相位数组中。'},
    {code:15,msgcode:'ERROR_FATHER_NOT_EXIST_CONCURRENT_PHASE',msg:'并发相位的相位号不存在于其并发相位的并发相位数组中。'},
    {code:16,msgcode:'ERROR_CHILD_NOT_CONTINUOUS_CONCURRENT_PHASE',msg:'并发相位的子相位在相序表中不连续。'},
    {code:17,msgcode:'ERROR_BARRIER_CONCURRENT_PHASE',msg:'并发相位的屏障一侧绿信比时间不相等。'},
    {code:18,msgcode:'ERROR_NOT_EQUAL_PHASE_TURN_CIRCLE',msg:'相序表中环号和相位表中该相位的环号不相同。'},
    {code:19,msgcode:'ERROR_NOT_CORRECT_PHASE_TURN',msg:'相序表中相位的序号和并发相位不匹配'},
    {code:20,msgcode:'ERROR_SPLIT_LOW_MOTO_GREEN_SIGNAL_RATION',msg:'绿信比表中周期长比机动车的绿闪、黄灯、全红之和小'},
    {code:21,msgcode:'ERROR_SPLIT_LOW_PEDESTRIAN_GREEN_SIGNAL_RATION',msg:'绿信比表中周期长比行人清空、行人放行时间之和小。'},
    {code:22,msgcode:'ERROR_ILLEGAL_SCHME',msg:'方案表中相序表或绿信比表ID非法。'},
    {code:23,msgcode:'ERROR_CIRCLE_TIME_SCHEME',msg:'方案表中周期长不等于单环绿信比之和'},
    {code:24,msgcode:'ERROR_NOT_EXIST_CONCURRENT_PHASE_PHASE',msg:'并发相位表中的并发相位ID不存在。'},
    {code:25,msgcode:'ERROR_NOT_EXIST_PHASE_TURN_PHASE',msg:'相序表中相位号不存在。'},
    {code:26,msgcode:'ERROR_NOT_EXIST_SOURCE_CHANNEL',msg:'通道表中该通道的控制源ID不存在。'},
    {code:27,msgcode:'ERROR_NOT_EXIST_SOURCE_FOLLOW_CHANNEL',msg:'通道表中该通道的跟随控制源ID不存在。'},
    {code:28,msgcode:'ERROR_NOT_EXIST_SOURCE_OTHER_CHANNEL',msg:'通道表中该通道的其他控制源ID不存在。'},
    {code:29,msgcode:'ERROR_NOT_EXIST_PHASE_TURN_SHCEME',msg:'方案表中相序表不存在。'},
    {code:30,msgcode:'ERROR_NOT_EXIST_GREEN_SIGNAL_RATION_SCHEME',msg:'方案表中绿信比表不存在。'},
    {code:31,msgcode:'ERROR_NOT_EXIST_SCHEME_ACTION',msg:'动作表中方案表不存在。'},
    {code:32,msgcode:'ERROR_NOT_EXIST_ACTION_TIMEINTERVAL',msg:'时段表中动作表不存在。'},
    {code:33,msgcode:'ERROR_NOT_EXIST_TIMEINTERVAL_SCHEDULE',msg:'调度表中时段表不存在。'},
    {code:34,msgcode:'ERROR_NOT_EXIST_MOTHER_PHASE_FOLLOW_PHASE',msg:'跟随表中母相位不存在。'},
    {code:35,msgcode:'ERROR_NOT_EXIST_CONCURRENT_PHASE_PHASE_2',msg:'相位表中有相位不存在并发相位。'},
    {code:36,msgcode:'ERROR_NOT_EXIST_PHASE_TURN_PHASE_2',msg:'相位表中有相位不存在于相序表中。'},
    {code:37,msgcode:'ERROR_NOT_EXIST_PHASE_GREEN_SIGNAL_RATION',msg:'相位表中有相位不存在与绿信比表中。'},
    {code:38,msgcode:'ERROR_REPEATE_CONCURRENT_PHASE',msg:'某相位的并发相位数组有重复值。'},
    {code:39,msgcode:'ERROR_REPEATE_PHASE_TURN',msg:'某相序表的相序数组有重复值。'},
    {code:40,msgcode:'ERROR_REPEATE_FOLLOW_PHASE',msg:'跟随相位表的跟随相位数组有重复值。'},
    {code:41,msgcode:'ERROR_REPEATE_SCHEDULE',msg:'调度表中有重复日期调度'},
    {code:42,msgcode:'ERROR_NOT_CONFIG_INFORMATION',msg:'配置信息为空'},
    {code:43,msgcode:'ERROR_ID_LEGAL_SCHEDULE',msg:'调度表ID不合法，范围必须是[0,108]'},
    {code:44,msgcode:'ERROR_ID_LEGAL_INTERVAL',msg:'时段表ID不合法，范围必须是[0,16]'},
    {code:45,msgcode:'ERROR_ID_LEGAL_INTERVAL_TIME',msg:'时段表中的时段ID不合法，范围必须是[0,48]'},
    {code:46,msgcode:'ERROR_ID_LEGAL_ACTION',msg:'动作表ID不合法，范围必须是[0,255]'},
    {code:47,msgcode:'ERROR_ID_LEGAL_SCHEME',msg:'方案表ID不合法，范围必须是[0,108]'},
    {code:48,msgcode:'ERROR_ID_LEGAL_PHASE',msg:'相位表ID不合法，范围必须是[0,16]'},
    {code:49,msgcode:'ERROR_ID_LEGAL_SPLIT',msg:'绿信比ID不合法，范围必须是[0,36]'},
    {code:50,msgcode:'ERROR_ID_LEGAL_PHASE_TURN',msg:'相序表ID不合法，范围必须是[0,16]'},
    {code:51,msgcode:'ERROR_ID_LEGAL_PHASE_TURN_ID',msg:'相序表的环号不合法，范围必须是[0,4]'},
    {code:52,msgcode:'ERROR_ID_LEGAL_FOLLOW_PHASE',msg:'跟随相位ID不合法，范围必须是[0,16]'},
    {code:53,msgcode:'ERROR_ID_LEGAL_CHANNEL',msg:'通道表ID不合法，范围必须是[0,16]'},
    {code:54,msgcode:'ERROR_PHASE_DISABLE',msg:'相位未使能'}
];

function getHikVisionErrorCode(code,callback){
    var codeMsg = hikvisionerrorcode[code];
    callback(codeMsg);
}


function getSetMsgTransCode(code){
    var codeMsg='';
    switch(code){
        case 0:{
            codeMsg='';
        }
        break;
        case -1:{
            codeMsg='编码失败';
        }
        break;
        case -2:{
            codeMsg='解码失败';
        }
        break;
        case -3:{
            codeMsg='发送消息失败';
        }
        break;
        case -4:{
            codeMsg='信号机未注册';
        }
        break;
        case -5:{
            codeMsg='参数为空';
        }
        break;
        case -6:{
            codeMsg='信号机已断开';
        }
        break;
        case -7:{
            codeMsg='信号机已注销';
        }
        break;
        case -8:{
            codeMsg='信号机通讯异常';
        }
        break;
        case -9:{
            codeMsg='初始化同步锁失败';
        }
        break;
        case -10:{
            codeMsg='信号机ID为0';
        }
        break;
        case -11:{
            codeMsg='语言版本不支持';
        }
        break;
        case -101:{
            codeMsg='编码参数错误';
        }
        break;
        case -102:{
            codeMsg='编码消息格式错误';
        }
        break;
        case -103:{
            codeMsg='未知的消息类型';
        }
        break;
        case -104:{
            codeMsg='编码块数据未定义';
        }
        break;
        case -105:{
            codeMsg='编码块数据错误';
        }
        break;
        case -106:{
            codeMsg='编码消息过长';
        }
        break;
        case -201:{
            codeMsg='解码消息格式错误';
        }
        break;
        case -202:{
            codeMsg='解码消息长度错误';
        }
        break;
        case -203:{
            codeMsg='解码参数错误';
        }
        break;
        case -204:{
            codeMsg='解码HIK消息头错误';
        }
        break;
        case -205:{
            codeMsg='解码生成的XML长度过长';
        }
        break;
        case -206:{
            codeMsg='解码扩展协议消息头错误';
        }
        break;
        case -207:{
            codeMsg='解码扩展协议校验错误';
        }
        break;
    }
    return codeMsg;
}

err={errCode:1,errorString:'设备不在线'}

module.exports = getHikVisionErrorCode;
module.exports = getSetMsgTransCode;

