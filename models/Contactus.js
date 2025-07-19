// model/recipe.js
const mongoose = require('mongoose');

const ContactusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String },
});

module.exports = mongoose.model('Contactus', ContactusSchema);
