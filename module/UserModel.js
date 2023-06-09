const mongoose = require("mongoose");

const User = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    min: 4,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 100,
  },
  isAdmin: {
    type: String,
    default: false,
  },
  courses: {
    type: Array,
    default: [],
  },
  phone: {
    type: String,
  },
  age: {
    type: String,
  },
  address: {
    type: String,
  },
  expertise: {
    type: String,
  },
  img: {
    data: Buffer,
    contentType: String,
  },
  about: {
    type: String,
  },
  coursesInCard: {
    type: Array,
    default: [],
  },
  teacher: {
    type: String,
    default: false,
  },
  prices: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 0
  },
  paymentDetail: {
    type: Object
  },
  fromUniversity: {
    type: String,
    default: false
  },
  coursesIdGeted: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", User);
