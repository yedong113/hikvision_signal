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

}


module.exports = config;
