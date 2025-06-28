const express = require('express');
const router = express.Router();
const runBot = require('../RunBot'); // Import your bot function
require('dotenv').config();

router.post('/', async (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  try {
    await runBot(keyword); // Pass the keyword to the bot
    return res.json({ message: 'Bot started successfully.' });
  } catch (error) {
    console.error('Error in bot:', error.message);
    return res.status(500).json({ error: 'Failed to run bot' });
  }
});

module.exports = router;