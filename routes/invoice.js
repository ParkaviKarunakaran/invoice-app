const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const { Item } = require('../models'); // Adjust the path as necessary

// Route to fetch items
router.get('/items', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create an item
router.post('/items', async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update an item
router.put('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (item) {
      await item.update(req.body);
      res.json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete an item
router.delete('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (item) {
      await item.destroy();
      res.status(204).json({ message: 'Item deleted' });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/items', async (req, res) => {
    const searchQuery = req.query.search || '';
  
    try {
        // Find one item that matches the search query
        const item = await Item.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { item_id: searchQuery },
                    { name: { [Sequelize.Op.iLike]: `%${searchQuery}%` } }
                ]
            }
        });
  
        if (item) {
            res.json(item); // Send the matching item
        } else {
            res.status(404).json({ message: 'No items found.' });
        }
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  module.exports = router;
  
  