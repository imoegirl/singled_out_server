// Require Mongoose
const mongoose = require('mongoose');

// 定义一个模式
const Schema = mongoose.Schema;

const NicknameSchema = new Schema({
    name: {type: String, unique: true, index: true},
    inuse: {type: Boolean},
});

// 导出函数来创建 "SomeModel" 模型类
module.exports = mongoose.model('Nicknames', NicknameSchema);