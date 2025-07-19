const mongoose = require('mongoose');

const recipeChallengeSchema = new mongoose.Schema({
  challengeName: { type: String, required: true },
  message: { type: String, required: true },
  deadline: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Receipechallenge', recipeChallengeSchema);
