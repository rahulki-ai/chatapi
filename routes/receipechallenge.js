const express = require('express');
const RecipeChallenge = require('../models/Receipechallenge'); // Assuming a RecipeChallenge model
const router = express.Router();

// Get all recipe challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await RecipeChallenge.find();
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe challenges' });
  }
});

// Add a new recipe challenge
router.post('/', async (req, res) => {
  const { challengeName, message, deadline } = req.body;

  // Validation for required fields
  if (!challengeName || !message || !deadline) {
    return res.status(400).json({ error: 'Challenge name, message, and deadline are required.' });
  }

  try {
    const challenge = new RecipeChallenge({
      challengeName,
      message,
      deadline,
    });
    await challenge.save();
    res.status(201).json({ message: 'Recipe challenge added successfully!', challenge });
  } catch (error) {
    console.error('Error adding recipe challenge:', error);
    res.status(500).json({ error: 'Failed to add recipe challenge.' });
  }
});

module.exports = router;
