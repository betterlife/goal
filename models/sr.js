//Goal Model
"use strict";
var marked = require('marked');
var model;

exports.getSchema = function (Schema) {
    var schema = new Schema({
        stockName       : { type : String, required : true },
        stockCode       : { type : String, required : true},
        recommendBroker : { type : String},
        recommendDate   : { type : Date, default : Date.now},
        recommendLevel  : { type : String},
        createDate      : { type : Date, default  : Date.now },
        industry        : { type : String},
        targetPrice     : {
            dateScope : {type: String},
            lower     : {type: Number},
            upper     : {type: Number}
        },
        comments: [{
            date    : { type : Date, default : Date.now },
            content : { type : String }
        }],
        remark : { type : String }
    });
    schema.virtual('markedRemark').get(function(){
        return marked(this.remark);
    });
    schema.set('toJSON', { virtuals: true });
    return schema;
};

exports.getModel = function (persistent) {
    if (model === undefined) {
        model = persistent.model('StockRecommend', exports.getSchema(persistent.Schema));
    }
    return model;
};

exports.getDateScope = function() {
    return ['六个月'];
};

exports.getBrokers = function() {
    return [
        '西南证券','国海证券','长城证券','东北证券','东方证券','民族证券','国联证券','兴业证券',
        '浙商证券','东兴证券','华泰证券','国信证券','长江证券','方正证券'
    ];
};

exports.getRecommendLevels = function () {
    return [ '强烈推荐', '推荐', '买入', '增持', '持有', '谨慎推荐', '中性'];
};

exports.getIndustries = function () {
    return [
        '农林牧副渔','农业','采掘业','煤炭采选业','制造业','食品饮食业','食品加工业','食品制造业',
        '酒及饮料业','纺织业','服装及纤维','木材家具业','造纸印刷业','石油加工','化学原料','化学肥料',
        '化学农药','专用化学品','化学纤维','塑料制造','电子元器件','日用电器','水泥制造业','玻璃制品业',
        '钢及钢材','有色金属','金属制品','机械制造业','专用制造业','汽车制造业','交运设备业','电器制造业',
        '医药制品业','生物制品业','公用事业','电力及供热','建筑业','交运及仓储','高速公路','水运港口',
        '信息技术业','通信设备','计算机设备','计算机应用','商业贸易','食品零批','设备批发业','百货零批',
        '医药零批','商业代理','金融保险业','房地产业','房产开发业','社会服务','宾馆饭店业','旅游业',
        '传播与文化','综合类'
    ];
};
