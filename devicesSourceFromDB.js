/**
 * KMLC信号机需要接入的设备列表获取方式。
 */

var mysql = require("mysql");
var URL = require('url');

//var config = require("./config.js");


function getFromDatabase(options_) {
    this.option = options_;
}

getFromDatabase.prototype.init = function() {

}

getFromDatabase.prototype.getDeviceList = function(callback) {
    var _this = this;
    if (!this.connectObj) {
        this.connectObj = mysql.createConnection({
            host: this.option.host,
            user: this.option.user,
            password: this.option.pwd,
            database: this.option.database
        });
    }

    this.connectObj.connect(function(err) {
        if (err) {
            console.log(err);
            callback([]);
        } else {
            console.log("connect db success!");//5326212777
            var sql = 'SELECT * from tb_device where TypeValue=211';
            sql = 'SELECT * from tb_device where DeviceId=5326212777';
            _this.connectObj.query(sql, function(err, rows, fields) {
                var devideList = [];
                for (var iix = 0; iix < rows.length; iix++) {
                    var urlbody = URL.parse(rows[iix].Url);
                    if (urlbody.protocol == 'HIK:' || urlbody.protocol == 'hik:') {
                        var tmp = {};
                        tmp.Id = rows[iix].DeviceId;
                        tmp.Url = rows[iix].Url;
                        tmp.Port = parseInt(urlbody.port);
                        tmp.Ip = urlbody.hostname;
                        tmp.DeviceType = rows[iix].TypeValue;
                        devideList.push(tmp);
                    }
                }
                callback(devideList);
            });
        }
    });
}

module.exports = getFromDatabase;