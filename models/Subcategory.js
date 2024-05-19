const mongoose = require('mongoose');
const Schema = mongoose.Schema;       

// Sub-category Schema
const SubCategorySchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  taxApplicability: { type: Boolean, default: true },
  tax: { type: Number, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
});

const SubCategory = mongoose.model('SubCategory', SubCategorySchema);

module.exports = SubCategory;
