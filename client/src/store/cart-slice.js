import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { products: [] },
  reducers: {
    addProduct(state, action) {
      const newProduct = action.payload;
      const foundProduct = state.products.find((product) => product._id === newProduct._id);
      if (foundProduct) {
        const total = foundProduct.selectedQuantity + newProduct.selectedQuantity;
        if (foundProduct.quantity >= total) {
          foundProduct.selectedQuantity = total;
        }
      } else {
        state.products = [...state.products, newProduct]; 
      }
    },
    updateSelectedQuantity(state, action) {
      const { productId, selectedQuantity } = action.payload;
      const foundProduct = state.products.find((product) => product._id === productId);
      if (foundProduct) {
        foundProduct.selectedQuantity = selectedQuantity;
      }
    },
    removeProduct(state, action) {
      const { productId } = action.payload;
      state.products = state.products.filter((product) => product._id !== productId);
    },
    removeProducts(state) {
      state.products = [];
    }
  }
});

export const cartActions = cartSlice.actions;

export default cartSlice;
