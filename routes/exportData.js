const express = require('express');
const router = express.Router();
const exportController = require('../controllers/companyYellowController');

router.post('/', async (req, res) => {
    try {
   const { categoryName } = req.body; // or req.query/categoryName if GET

        // Validate input
        if (!categoryName) {
            return res.status(400).json({ message: 'Category name is required' });
        }
        
        // Call the export function from the controller
        await exportController.exportCompaniesByCategory(req, res);
    } catch (error) {
        console.error('Error exporting data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;