var kafka = require('kafka-node');
var HighLevelProducer = kafka.HighLevelProducer;
var Client = kafka.Client;
var client = new Client('ZK01:19092');
var topic = 'ITSCRealData';
var count = 10;
var rets = 0;
var producer = new HighLevelProducer(client);

producer.on('ready', function () {
    console.log('111111111111111');
    setInterval(send, 1000);
});

producer.on('error', function (err) {
    console.log('error', err);
});

function send () {
    var message = new Date().toString();
    producer.send([
        {topic: topic, messages: [message]}
    ], function (err, data) {
        if (err) console.log(err);
        else console.log('send %d messages', ++rets);
        if (rets === count) process.exit();
    });
}