var config = {
	port: 1555,
	mysql:{
		host:'53.28.100.34',
		port:3306,
		user:'wsjj_p',
		pwd:'kmlckj@wsjj_2016',
		database:'trafficcenter'
	},
	reportPara:{
		kafkaHost:'ZK01:19092',
		topic:"ITSCRealData"
	},
	UDPListenPort:10000,
	localhost:'53.28.100.107',
	hikControlMode:{
		systemMode:'<?xml version="1.0"?><xmlRoot><Control Operate="Set"><Mode><PatternNo>0</PatternNo></Mode></Control></xmlRoot>',
		fullRedMode:'<?xml version="1.0"?><xmlRoot><Control Operate="Set"><Mode><PatternNo>252</PatternNo></Mode></Control></xmlRoot>',
		flashYellowMode:'<?xml version="1.0"?><xmlRoot><Control Operate="Set"><Mode><PatternNo>255</PatternNo></Mode></Control></xmlRoot>',
        closeLightMode:'<?xml version="1.0"?><xmlRoot><Control Operate="Set"><Mode><PatternNo>251</PatternNo></Mode></Control></xmlRoot>',
        cancelControlMode:'<?xml version="1.0"?><xmlRoot><Control Operate="Set"><Mode><PatternNo>0</PatternNo></Mode></Control></xmlRoot>',
        changeScheme:'<?xml version="1.0"?><xmlRoot><Control Operate="Set"><Mode><PatternNo>0</PatternNo></Mode></Control></xmlRoot>'
	}
}


module.exports = config;
