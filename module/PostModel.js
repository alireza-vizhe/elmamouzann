const mongoose = require("mongoose");

const Post = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 50
    },
    status: {
        type: String,
        required: true,
        enum: ['private', 'public']
    },
    description: {
        type: String,
        required: true,
        min: 50,
        max: 800
    },
    work_kind: {
        type: String,
        required: true,
        default: "persian",
        enum: ["english", "persian"]
    },
    work_to: {
        type: String,
        required: true,
        default: "online",
        enum: ["in-person", "online"]
    },
    nameImg: String,
    img: {
        data: Buffer,
        contentType: String,
    },
    describeVideo: {
        data: Buffer,
        contentType: String,
    },
    courseVideos: {
        Type: String,
    },
    price: {
        type: String,
        required: true
    },
    userD: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required:true
    },
    time: {
        type: String,
        required: true
    },
    visits: {
        type: Number,
        default: 0
    },
    totalStudents: {
        type: Number,
        default: 0
    },
    monthlyStudents: {
        type: Number,
        default: 0
    },
    comments: {
        type: Array,
        default: []
    },
    commenterName: {
        type: Array,
        default: []
    },
    commentedDate:{
        type: Date,
        default: Date.now
    },
    answerComments: {
        type: Array,
        default: []
    },
    likes: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    progress: {
        type: String,
    },
    ended: {
        type: String,
        required: true,
        default: "false",
        enum: ["true", "false"]
    },
    courseExam: {
        type: Array,
        default: []
    },
    examLink: {
        type: String,
        default: ""
    },
    sells: {
        type: Array,
        default: []
    },
    postLevel: {
        type: String
    },
    suqqestion:{
        type: String,
    },
    inTheFuture: {
        type: String,
        default: "0"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', Post);