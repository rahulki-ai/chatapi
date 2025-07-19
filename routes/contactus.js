// route/contactus.js
const express = require('express');
const Contactus = require('../models/Contactus');
const router = express.Router();

// Get all messages
router.get('/get', async (req, res) => {
  try {
    const messages = await Contactus.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});


// Add a message
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const messages = new Contactus({ name, email, message});
    await messages.save();
    res.status(201).json(messages);
  } catch (error) {
    res.status(400).json({ error: 'Failed to store message' });
  }
});

module.exports = router;
