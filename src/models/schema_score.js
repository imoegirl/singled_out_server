// Require Mongoose
const mongoose = require('mongoose');

// 定义一个模式
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
    guid: {type: String, unique: true},
    name: {type: String, unique: true, index: true},
    score: {type: Number, index: true},
    date: Date
});

// 导出函数来创建 "SomeModel" 模型类
module.exports = mongoose.model('Scores', ScoreSchema);