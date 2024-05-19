const express = require("express");
const router = express.Router();    
const Category = require("../models/Category");
const SubCategory = require("../models/Subcategory");


// API to create a sub-category under a category
router.post('/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, image, description, taxApplicability, tax } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subCategory = new SubCategory({
      name,
      image,
      description,
      taxApplicability: taxApplicability ?? category.taxApplicability,
      tax: tax ?? category.tax,
      category: categoryId
    });

    const savedSubCategory = await subCategory.save();

    res.status(201).json(savedSubCategory);
  } catch (error) {
    console.error('Error creating sub-category:', error);
    res.status(500).json({ message: 'Error creating sub-category', error });
  }
});

// API to get all sub-categories
router.get('/', async (req, res) => {
  try {
    const subCategories = await SubCategory.find();
    res.status(200).json(subCategories);
  } catch (error) {
    console.error('Error fetching sub-categories:', error);
    res.status(500).json({ message: 'Error fetching sub-categories', error });
  }
});

// API to get all sub-categories under a category
router.get('/:categoryId/subcategories', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subCategories = await SubCategory.find({ category: categoryId });
    res.status(200).json(subCategories);
  } catch (error) {
    console.error('Error fetching sub-categories for category:', error);
    res.status(500).json({ message: 'Error fetching sub-categories for category', error });
  }
});

// API to get a sub-category by name or ID along with its attributes
router.get('/subcategories/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let subCategory;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      subCategory = await SubCategory.findById(identifier).populate('category');
    } else {
      subCategory = await SubCategory.findOne({ name: identifier }).populate('category');
    }

    if (!subCategory) {
      return res.status(404).json({ message: 'Sub-category not found' });
    }

    res.status(200).json(subCategory);
  } catch (error) {
    console.error('Error fetching sub-category:', error);
    res.status(500).json({ message: 'Error fetching sub-category', error });
  }
});

// API to edit sub-category attributes
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedSubCategory) {
      return res.status(404).json({ message: 'Sub-category not found' });
    }

    res.status(200).json(updatedSubCategory);
  } catch (error) {
    console.error('Error updating sub-category:', error);
    res.status(500).json({ message: 'Error updating sub-category', error });
  }
});

module.exports = router