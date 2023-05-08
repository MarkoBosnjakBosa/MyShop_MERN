import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartSlice from "./cart-slice";

const reducers = combineReducers({ cart: cartSlice.reducer });
const persistedConfiguration = { key: "root", storage };
const persistedReducer = persistReducer(persistedConfiguration, reducers);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});

export default store;
