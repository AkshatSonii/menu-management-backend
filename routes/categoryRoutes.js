const express = require("express");
const router = express.Router();    
const Category = require("../models/Category");


// Endpoint to create a category
router.post('/', async (req, res) => {
  try {
    const { name, image, description, taxApplicability, tax, taxType } = req.body;
    
    const newCategory = new Category({
      name,
      image,
      description,
      taxApplicability,
      tax,
      taxType
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Error creating category', error });
  }
});


// Endpoint to get all categories
router.get('/all', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error });
  }
});



// Endpoint to get a category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('subCategories');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    res.status(500).json({ message: 'Error fetching category by ID', error });
  }
});


// Endpoint to get a category by name
router.get('/', async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.query.name }).populate('subCategories');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category by name:', error);
    res.status(500).json({ message: 'Error fetching category by name', error });
  }
});



// Endpoint to edit category attributes
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category', error });
  }
});

module.exports = router
