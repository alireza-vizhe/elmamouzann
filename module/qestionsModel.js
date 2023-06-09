const mongoose = require("mongoose");

const Questions = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        min: 4,
        max: 50
    },
    email: {
        type: String,
        required: true,
        unique: false
    },
    questionTitle: {
        type: String,
        required: true
    },
    question: {
        type: String,
        require: true
    },
    courseId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    answer: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
})

module.exports = mongoose.model("Questions", Questions);