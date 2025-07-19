const mongoose = require('mongoose');

const challengeRecipeSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  recipeName: { type: String, required: true },
  ingredients: { type: String, required: true },
  instructions: { type: String, required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  image: { type: String }, // URL or file path for the image
  upvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Receipesubmit', challengeRecipeSchema);
