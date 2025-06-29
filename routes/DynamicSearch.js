const express = require('express');
const router = express.Router();
const runBot = require('../RunBot'); // Import your bot function
const Category = require('../models/Category');
require('dotenv').config();

router.post('/', async (req, res) => {
const { category_id } = req.body;
  if (!category_id) {
    return res.status(400).json({ error: 'category_id is required' });
  }

  try {

        // Validate and load category from DB
    const category = await Category.findById(category_id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const keyword = category.name;
    await runBot(keyword); // Pass the keyword to the bot
    // You can now use category data as needed
    // Example: await runBot(category.keyword)
    return res.json({ message: 'Bot started successfully.' });
  } catch (error) {
    console.error('Error in bot:', error.message);
    return res.status(500).json({ error: 'Failed to run bot' });
  }
});

module.exports = router;