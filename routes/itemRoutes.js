const express = require("express");
const router = express.Router();    
const Category = require("../models/Category");
const SubCategory = require("../models/Subcategory");
const Item = require("../models/Item");

// API to create an item
router.post('/', async (req, res) => {
  try {
    const { name, image, description, taxrouterlicability, tax, baseAmount, discount, subCategory } = req.body;

    const subCat = await SubCategory.findById(subCategory);
    if (!subCat) {
      return res.status(404).json({ message: 'Sub-category not found' });
    }

    const item = new Item({
      name,
      image,
      description,
      taxrouterlicability,
      tax,
      baseAmount,
      discount,
      subCategory
    });

    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Error creating item', error });
  }
});

// API to get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items', error });
  }
});

// API to get all items under a category
router.get('category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subCategories = await SubCategory.find({ category: categoryId }).select('_id');
    const subCategoryIds = subCategories.map(subCat => subCat._id);
    const items = await Item.find({ subCategory: { $in: subCategoryIds } });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items for category:', error);
    res.status(500).json({ message: 'Error fetching items for category', error });
  }
});

// API to get all items under a sub-category
router.get('subcategory/:subCategoryId', async (req, res) => {
  try {
    const { subCategoryId } = req.params;
    const items = await Item.find({ subCategory: subCategoryId });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items for sub-category:', error);
    res.status(500).json({ message: 'Error fetching items for sub-category', error });
  }
});

// API to get an item by name or ID along with its attributes
router.get('item/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let item;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      item = await Item.findById(identifier).populate('subCategory');
    } else {
      item = await Item.findOne({ name: identifier }).populate('subCategory');
    }

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Error fetching item', error });
  }
});


module.exports = router

// API to edit item attributes
router.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedItem = await Item.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('subCategory');

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Error updating item', error });
  }
});

// API to search items by name
router.get('/search/items', async (req, res) => {
  try {
    const { name } = req.query;
    const items = await Item.find({ name: new RegExp(name, 'i') }).populate('subCategory');
    res.status(200).json(items);
  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({ message: 'Error searching items', error });
  }
});