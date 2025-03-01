const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    title: String,
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Banner', bannerSchema);
