const express = require("express");
const { HfInference } = require("@huggingface/inference");
require("dotenv").config();

const router = express.Router();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

router.post("/", async (req, res) => {
  console.log("Received body:", req.body); // Debug incoming request body

  const { ingredients } = req.body;

  if (!ingredients) {
    return res.status(400).json({ error: "Ingredients are required" });
  }

  try {
    const prompt = `Create a recipe using these ingredients: ${ingredients}. Include preparation steps.`;
    const response = await hf.textGeneration({
      model: "bigscience/bloom-560m",
      inputs: prompt,
      parameters: { max_new_tokens: 150 },
    });
    console.log(response)
    res.json({ recipe: response.generated_text });
  } catch (error) {
    console.error("Error generating recipe:", error);
    res.status(500).json({ error: "Failed to generate recipe" });
  }
});

module.exports = router;
