import * as mongoose from "mongoose";

const orderScheme = new mongoose.Schema({
  orderNumber: { type: Number, required: true, index: { unique: true } },
  userId: { type: String, required: true },
  paymentType: { type: String, required: true },
  products: { type: Array, required: true },
  totalPrice: { type: String, required: true },
  date: { type: Number, required: true },
  dispatched: { type: Number },
  user: {
    account: {
      username: { type: String, required: true },
      email: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      mobileNumber: { type: String, required: true }
    },
    address: {
      street: { type: String, required: true },
      houseNumber: { type: Number, required: true, min: 0 },
      city: { type: String, required: true },
      zipCode: { type: Number, required: true, min: 0 },
      country: { type: String, required: true }
    }
  }
});

const Order = mongoose.model("Order", orderScheme);

export default Order;
