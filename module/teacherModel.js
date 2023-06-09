const mongoose = require("mongoose");

const Teacher = mongoose.Schema({
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
  phone: {
    type: Number,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true
  },
  sendAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Teacher", Teacher);
