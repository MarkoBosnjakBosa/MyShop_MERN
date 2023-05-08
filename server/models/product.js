import * as mongoose from "mongoose";

const productScheme = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 0 },
  categoryId: { type: String, required: true },
  technicalData: { type: Array },
  primaryImage: { name: String, mimeType: String, buffer: Buffer },
  images: [{ name: String, mimeType: String, buffer: Buffer }],
  rating: { type: Object, required: true },
  date: { type: Number, required: true }
});

const Product = mongoose.model("Product", productScheme);

export default Product;
