const express = require('express');
const multer = require("multer");
const upload = multer(); 
const ChallengeRecipe = require('../models/Receipesubmit');
const router = express.Router();

// Submit a recipe for a challenge
router.post("/", upload.single("image"), async (req, res) => {
    const { userName, recipeName, ingredients, instructions, challengeId } = req.body;
    const image = req.file; // The uploaded file will be here
  
    // Validate required fields
    if (!userName || !recipeName || !ingredients || !instructions || !challengeId) {
      return res.status(400).json({ error: "All fields except image are required." });
    }
  
    // Log the parsed data for debugging
    console.log("Parsed Body:", req.body);
    console.log("Uploaded File:", image);
  
    try {
      const challengeRecipe = new ChallengeRecipe({
        userName,
        recipeName,
        ingredients,
        instructions,
        challengeId,
        image: image ? image.buffer.toString("base64") : null, // Save image as Base64
      });
  
      await challengeRecipe.save();
      res.status(201).json({
        message: "Recipe submitted to challenge successfully!",
        challengeRecipe,
      });
    } catch (error) {
      console.error("Error submitting challenge recipe:", error);
      res.status(500).json({ error: "Failed to submit recipe to challenge." });
    }
  });

  router.post("/upvote/:id", async (req, res) => {
    const { userId } = req.body; // Assuming frontend sends user ID
  
    if (!userId) {
      return res.status(400).json({ error: "User ID is required to upvote." });
    }
  
    try {
      const recipe = await ChallengeRecipe.findById(req.params.id);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
  
      // Check if user has already upvoted
      if (recipe.upvotedBy.includes(userId)) {
        return res.status(400).json({ error: "You have already upvoted this recipe." });
      }
  
      // Add user to upvoted list and increase count
      recipe.upvotes += 1;
      recipe.upvotedBy.push(userId);
      await recipe.save();
  
      res.status(200).json({ message: "Upvote successful!", upvotes: recipe.upvotes });
    } catch (error) {
      console.error("Error upvoting recipe:", error);
      res.status(500).json({ error: "Failed to upvote recipe." });
    }
  });
  

// Get all recipes for a specific challenge
router.get('/:challengeId', async (req, res) => {
  const { challengeId } = req.params;

  try {
    const challengeRecipes = await ChallengeRecipe.find({ challengeId });
    console.log(challengeRecipes)
    res.status(200).json(challengeRecipes);
  } catch (error) {
    console.error('Error fetching challenge recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes for challenge.' });
  }
});

module.exports = router;
