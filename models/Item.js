const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Item Schema
const ItemSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  taxApplicability: { type: Boolean, required: true },
  tax: { type: Number, required: true },
  baseAmount: { type: Number, required: true },
  discount: { type: Number, required: true },
  totalAmount: {
    type: Number,
    required: true,
    default: function() {
      return this.baseAmount - this.discount;
    }
  },
  subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: true }
});


const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;