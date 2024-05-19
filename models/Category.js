const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Category Schema
const CategorySchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  taxApplicability: { type: Boolean, required: true },
  tax: { type: Number, required: true },
  taxType: { type: String, required: true }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;