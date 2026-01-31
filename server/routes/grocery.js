const express = require('express');
const router = express.Router();
const { getGroceryItems, addGroceryItem, updateGroceryItem, deleteGroceryItem, clearCompleted, toggleGroceryItem } = require('../controllers/groceryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getGroceryItems);
router.post('/', protect, addGroceryItem);
router.put('/:id', protect, updateGroceryItem);
router.patch('/:id/toggle', protect, toggleGroceryItem);
router.delete('/:id', protect, deleteGroceryItem);
router.delete('/completed', protect, clearCompleted);

module.exports = router;
