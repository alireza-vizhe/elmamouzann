const mongoose = require("mongoose");

const Articles = mongoose.Schema({
    articleName: {
        type: String
    },
    articleContent: {
        type: String
    },
    nameImg: String,
    img: {
        data: Buffer,
        contentType: String,
    },
    writerName: {
        type: String
    },
    writterId: {
        type: String
    },
    status: {
        type: String,
        required: true,
        enum: ['private', 'public']
    },
    category: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Articles", Articles);