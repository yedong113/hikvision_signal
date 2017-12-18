//本配置问价定义海康信号机通道与公司路口定义的对照关系
//通道类型:0 行人 1 直行 2 左转 3右转
channelConfig = {
    phase:[
        {id:1,name:'东西直行'},
        {id:2,name:'东西左转'},
        {id:3,name:'南北直行'},
        {id:4,name:'东西左转'}
    ],
    chanel:[
        {id:1, type:1,roadid:7, name:'机动车由西向东左转'},
        {id:2, type:2,roadid:7, name:'机动车由西向东直行'},
        {id:3, type:3,roadid:7, name:'机动车由西向东右转'},
        {id:4, type:4,roadid:3, name:'东方向行人'},
        {id:5, type:1,roadid:1, name:'机动车由北向南左转'},
        {id:6, type:2,roadid:1, name:'机动车由北向南直'},
        {id:7, type:3,roadid:1, name:'机动车由北向南右转'},
        {id:8, type:4,roadid:5, name:'南方向行人'},
        {id:9, type:1,roadid:3, name:'机动车由东向西左转'},
        {id:10,type:2,roadid:3,name:'机动车由东向西直行'},
        {id:11,type:3,roadid:3,name:'机动车由东向西右转'},
        {id:12,type:4,roadid:7,name:'西方向行人'},
        {id:13,type:1,roadid:5,name:'机动车由南向北左转'},
        {id:14,type:2,roadid:5,name:'机动车由南向北直行'},
        {id:15,type:3,roadid:5,name:'机动车由南向北右转'},
        {id:16,type:4,roadid:1,name:'北方向行人'}
    ],
    kmlc2hikChannelTable:[
        /*海康通道ID      路口编号  车道类型   相位     控制类型 */
        {hikChannelId:1, cornor:7,laneType:1,phase:2,controlType:2},
        {hikChannelId:2, cornor:7,laneType:2,phase:1,controlType:2},
        {hikChannelId:3, cornor:7,laneType:3,phase:0,controlType:2},
        {hikChannelId:4, cornor:3,laneType:4,phase:3,controlType:3},
        {hikChannelId:5, cornor:1,laneType:1,phase:4,controlType:2},
        {hikChannelId:6, cornor:1,laneType:2,phase:3,controlType:2},
        {hikChannelId:7, cornor:1,laneType:3,phase:0,controlType:2},
        {hikChannelId:8, cornor:5,laneType:4,phase:1,controlType:3}, 
        {hikChannelId:9, cornor:3,laneType:1,phase:2,controlType:2},
        {hikChannelId:10,cornor:3,laneType:2,phase:1,controlType:2},
        {hikChannelId:11,cornor:3,laneType:3,phase:0,controlType:2},
        {hikChannelId:12,cornor:7,laneType:4,phase:3,controlType:3},
        {hikChannelId:13,cornor:5,laneType:1,phase:4,controlType:2},
        {hikChannelId:14,cornor:5,laneType:2,phase:3,controlType:2},
        {hikChannelId:15,cornor:5,laneType:3,phase:0,controlType:2},
        {hikChannelId:16,cornor:1,laneType:4,phase:1,controlType:3}
    ]
}



module.exports = channelConfig;