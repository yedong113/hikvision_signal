var setTable = {
    Id: "5326212777",
    //通道表
    ChannelTable: [
        { ChannleId: 1, 
            ChannelDescribe: "left", 
            ChannelType: 1, 
            ConflictChannel: 0 },
        { ChannleId: 2, 
            ChannelDescribe: "direct", 
            ChannelType: 2, 
            ConflictChannel: 0 }
    ],
    //相位表
    PhaseTable: [
        { PhaseId: 1, 
            OutChannel: 124, 
            ConflictPhase: 0, 
            Cornor: 1, 
            LaneType: 1 },
        { PhaseId: 2, 
            OutChannel: 346, 
            ConflictPhase: 0, 
            Cornor: 1, 
            LaneType: 1 },
        { PhaseId: 3, 
            OutChannel: 5773, 
            ConflictPhase: 0, 
            Cornor: 1, 
            LaneType: 1 }
    ],
    //计划表
    ScheduleTable: [{
            PlaneID: 1,
            SpecialDayTable: [
                { Month: 111111, Day: 111111, PeriodTableId: 1 },
                { Month: 111111, Day: 111111, PeriodTableId: 2 }
            ],
            Week: { Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 2, Sun: 1 }
        },
        {
            PlaneID: 2,
            SpecialDayTable: [
                { Month: 111111, Day: 111111, PeriodTableId: 1 },
                { Month: 111111, Day: 111111, PeriodTableId: 2 }
            ],
            Week: { Mon: 1, Tue: 3, Wed: 1, Thu: 1, Fri: 1, Sat: 2, Sun: 1 }
        }
    ],
    //时段表
    PeriodTimeTable: [{
        TimeIntervalTableId: 1,
        TimeIntervalInfo: [
            { TimeIntervalId: 1, StartHour: 0, StartMinute: 0, SchemeTabelId: 1 },
            { TimeIntervalId: 2, StartHour: 6, StartMinute: 0, SchemeTabelId: 3 }
        ]
    }, {
        TimeIntervalTableId: 2,
        TimeIntervalInfo: [
            { TimeIntervalId: 1, StartHour: 0, StartMinute: 0, SchemeTabelId: 1 },
            { TimeIntervalId: 2, StartHour: 12, StartMinute: 0, SchemeTabelId: 2 }
        ]
    }],
    //方案表
    SchemeTable: [{
        StageTabelId: 1,
        RecycleTime: 60,
        Offset: 0,
        Coordphase: 0,
        StageData: [{
                StageId: 1,
                Duration: 12,
                PhaseBitmap: 333,
                Green: 12,
                GreenFlash: 12,
                Yellow: 22,
                YellowFlash: 0,
                Red: 12,
                RedFlash: 223,
                MinGreen: 60,
                MaxGreen: 30,
                WalkLight: 12,
                WalkFlash: 0,
                Delta: 0
            },
            {
                StageId: 2,
                Duration: 12,
                PhaseBitmap: 333,
                Green: 12,
                GreenFlash: 12,
                Yellow: 22,
                YellowFlash: 0,
                Red: 12,
                RedFlash: 223,
                MinGreen: 60,
                MaxGreen: 30,
                WalkLight: 12,
                WalkFlash: 0,
                Delta: 0
            }
        ]
    }, {
        stageTabelId: 2,
        recycleTime: 90,
        Offset: 0,
        Coordphase: 0,
        StageData: [{
                StageId: 1,
                Duration: 12,
                PhaseBitmap: 333,
                Green: 12,
                GreenFlash: 12,
                Yellow: 22,
                YellowFlash: 0,
                Red: 12,
                RedFlash: 223,
                MinGreen: 60,
                MaxGreen: 30,
                WalkLight: 12,
                WalkFlash: 0,
                Delta: 0
            },
            {
                StageId: 2,
                Duration: 12,
                PhaseBitmap: 333,
                Green: 12,
                GreenFlash: 12,
                Yellow: 22,
                YellowFlash: 0,
                Red: 12,
                RedFlash: 223,
                MinGreen: 60,
                MaxGreen: 30,
                WalkLight: 12,
                WalkFlash: 0,
                Delta: 0
            }
        ]
    }]
}


module.exports = setTable;