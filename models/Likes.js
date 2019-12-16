const mongoose = require('mongoose');

const LikeSchema = mongoose.Schema({
    ip: String,
    stock: String,
    active: {
        type: Boolean,
        default: true
    }
});

const LikeModel = mongoose.model('Likes', LikeSchema);

module.exports = {
    model: LikeModel,
    schema: LikeSchema
};