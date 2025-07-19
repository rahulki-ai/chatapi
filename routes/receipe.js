// route/recipe.js
const express = require('express');
const Recipe = require('../models/Receipe');
const router = express.Router();

// Get all recipes
// Get recipes (filtered by veg/non-veg if specified)
router.get('/get', async (req, res) => {
  try {
    const { isVeg } = req.query; // Extract query parameter

    let filter = {};
    if (isVeg !== undefined) {
      // Convert the query parameter to a boolean
      filter.isVeg = isVeg === 'true';
    }

    const recipes = await Recipe.find(filter);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Get a recipe by ID
router.get('/get/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const recipe = await Recipe.findById(id); // Find recipe by ID
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      res.status(200).json(recipe);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recipe' });
    }
  });
  router.get('/getbyname/:name', async (req, res) => {
    const { name } = req.params;
  
    try {
      const recipe = await Recipe.findOne({ name: { $regex: new RegExp(name, 'i') } }); // Find recipe by ID
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      res.status(200).json(recipe);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recipe' });
    }
  });
  
// Add a new recipe
router.post('/', async (req, res) => {
  const { name, ingredients, instructions, category, author, isVeg } = req.body;

  try {
    const recipe = new Recipe({ name, ingredients, instructions, category , author, isVeg});
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create recipe' });
  }
});

module.exports = router;
