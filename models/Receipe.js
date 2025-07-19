// model/recipe.js
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: { type:Array},
  instructions: { type: String, required: true },
  category: { type: String },
  author: {type: String},
  isVeg: { type: Boolean, required: true },
});

module.exports = mongoose.model('Receipe', recipeSchema);
