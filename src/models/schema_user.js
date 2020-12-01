// Require Mongoose
const mongoose = require('mongoose');

// 定义一个模式
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    guid: {type: String, unique: true, index: true},
    name: {type: String, unique: true, index: true},
    date: Date
});

// 导出函数来创建 "SomeModel" 模型类
module.exports = mongoose.model('Users', UserSchema);