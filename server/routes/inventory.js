const express = require('express');
const router = express.Router();
const { getItems, addItem, updateItem, deleteItem } = require('../controllers/inventoryController');

// All routes are prefixed with /api/inventory
router.route('/')
    .get(getItems)
    .post(addItem);

router.route('/:id')
    .put(updateItem)
    .delete(deleteItem);

module.exports = router;
