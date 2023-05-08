import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import * as dotenv from "dotenv";
import path from "path";
import * as mongoose from "mongoose";

import { createAdministrator } from "./utilities/administration.js";
import { checkAuthentication } from "./routes/checkAuthentication.js";
import { checkAuthorization } from "./routes/checkAuthorization.js";
import { registration, confirmation } from "./routes/registration.js";
import { login, authenticate, sendAuthenticationToken } from "./routes/login.js";
import { credentials, sendConfirmationEmail, resetPasswordLoggedIn, resetPasswordLoggedOut } from "./routes/credentials.js";
import { getProfile, editAccount, editAddress, getAvatar, saveAvatar } from "./routes/profile.js";
import { getAuthentication, setAuthentication, sendAuthenticationEnablingToken } from "./routes/setup.js";
import { getCategories, createCategory, editCategory, deleteCategory } from "./routes/categories.js";
import { getTechnicalData, createTechnicalInformation, deleteTechnicalInformation } from "./routes/technicalData.js";
import { getProducts, getProduct, createProduct, editProduct, deleteProduct, downloadProducts } from "./routes/products.js";
import { rateProduct, getReviews, writeReview, deleteReview } from "./routes/reviews.js";
import { getHomeSettings, saveHomeSettings } from "./routes/home.js";
import { getContactSettings, saveContactSettings, getContacts, saveContact, deleteContact } from "./routes/contacts.js";
import { getUsers, getUser, deleteUser } from "./routes/users.js";
import { createCheckoutSession } from "./routes/checkout.js";
import { getOrders, getUserOrders, getOrder, createOrder, dispatchOrder, deleteOrder, downloadInvoice, downloadOrders } from "./routes/orders.js";
import { isLoggedIn } from "./middleware/checkAuthentication.js";
import { hasPermission } from "./middleware/checkAuthorization.js";
import validations from "./middleware/validations.js";
import uploadImage from "./middleware/uploadImage.js";
import chat, { searchUser } from "./chat/chat.js";
import backup from "./database/backup.js";

const app = express();
const http = createServer(app);
const io = new Server(http, { cors: { origin: "*" } });
chat(io);
backup();
dotenv.config();
const directory = path.resolve();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/temporary", express.static(`${directory}/temporary`));

app.get("/checkAuthentication", [isLoggedIn], checkAuthentication);
app.get("/checkAuthorization", [isLoggedIn, hasPermission], checkAuthorization);
app.post("/registration", [validations.validateRegistration], registration);
app.get("/confirmation", [validations.validateConfirmation], confirmation);
app.post("/login", [validations.validateLogin], login);
app.post("/authenticate", [validations.validateAuthentication], authenticate);
app.put("/sendAuthenticationToken", [validations.validateObjectId], sendAuthenticationToken);
app.post("/credentials", [validations.validateCredentials], credentials);
app.put("/sendConfirmationEmail", [validations.validateObjectId], sendConfirmationEmail);
app.put("/resetPasswordLoggedIn", [isLoggedIn, validations.validatePasswordReset], resetPasswordLoggedIn);
app.put("/resetPasswordLoggedOut", [validations.validatePasswordReset], resetPasswordLoggedOut);
app.get("/getProfile/:userId", [isLoggedIn, validations.validateObjectId], getProfile);
app.put("/editAccount", [isLoggedIn, validations.validateAccount], editAccount);
app.put("/editAddress", [isLoggedIn, validations.validateAddress], editAddress);
app.get("/getAvatar/:userId", [isLoggedIn, validations.validateObjectId], getAvatar);
app.post("/saveAvatar", [isLoggedIn, uploadImage.single("avatar"), validations.validateObjectId], saveAvatar);
app.put("/editAddress", [isLoggedIn, validations.validateAddress], editAddress);
app.get("/getAuthentication/:userId", [isLoggedIn, validations.validateObjectId], getAuthentication);
app.put("/setAuthentication", [isLoggedIn, validations.validateAuthenticationEnabling], setAuthentication);
app.put("/sendAuthenticationEnablingToken", [isLoggedIn, validations.validateObjectId], sendAuthenticationEnablingToken);
app.get("/getCategories", getCategories);
app.post("/createCategory", [isLoggedIn, hasPermission, validations.validateCategory], createCategory);
app.put("/editCategory", [isLoggedIn, hasPermission, validations.validateCategory], editCategory);
app.delete("/deleteCategory/:categoryId", [isLoggedIn, hasPermission, validations.validateObjectId], deleteCategory);
app.get("/getTechnicalData", [isLoggedIn, hasPermission], getTechnicalData);
app.post("/createTechnicalInformation", [isLoggedIn, hasPermission, validations.validateTechnicalInformation], createTechnicalInformation);
app.delete("/deleteTechnicalInformation/:technicalInformationId", [isLoggedIn, hasPermission, validations.validateObjectId], deleteTechnicalInformation);
app.post("/getProducts", getProducts);
app.get("/getProduct/:productId", [validations.validateObjectId], getProduct);
app.post("/createProduct", [isLoggedIn, hasPermission, uploadImage.fields([{ name: "primaryImage" }, { name: "images", maxCount: 4 }]), validations.validateProduct], createProduct);
app.put("/editProduct", [isLoggedIn, hasPermission, uploadImage.fields([{ name: "primaryImage" }, { name: "images", maxCount: 4 }]), validations.validateProduct], editProduct);
app.delete("/deleteProduct/:productId", [isLoggedIn, hasPermission, validations.validateObjectId], deleteProduct);
app.post("/download/products", [isLoggedIn, hasPermission], downloadProducts);
app.put("/rateProduct", [isLoggedIn, validations.validateRating], rateProduct);
app.post("/getReviews", [validations.validateObjectId], getReviews);
app.post("/writeReview", [isLoggedIn, validations.validateReview], writeReview);
app.delete("/deleteReview/:reviewId/:userId", [isLoggedIn, validations.validateObjectId], deleteReview);
app.get("/getHomeSettings", getHomeSettings);
app.post("/saveHomeSettings", [isLoggedIn, hasPermission, uploadImage.array("images", 4)], saveHomeSettings);
app.get("/getContactSettings", getContactSettings);
app.post("/saveContactSettings", [isLoggedIn, hasPermission, validations.validateContactSettings], saveContactSettings);
app.post("/getContacts", [isLoggedIn, hasPermission], getContacts);
app.post("/saveContact", [validations.validateContact], saveContact);
app.delete("/deleteContact/:contactId", [isLoggedIn, hasPermission, validations.validateObjectId], deleteContact);
app.post("/getUsers", [isLoggedIn, hasPermission], getUsers);
app.get("/getUser/:userId", [isLoggedIn, hasPermission, validations.validateObjectId], getUser);
app.delete("/deleteUser/:userId", [isLoggedIn, hasPermission, validations.validateObjectId], deleteUser);
app.post("/createCheckoutSession", [isLoggedIn, validations.validateCheckoutSession], createCheckoutSession);
app.post("/createOrder", [isLoggedIn, validations.validatePayment], createOrder);
app.post("/getOrders", [isLoggedIn, hasPermission], getOrders);
app.post("/getUserOrders", [isLoggedIn, validations.validateObjectId], getUserOrders);
app.get("/getOrder/:orderId", [isLoggedIn, validations.validateObjectId], getOrder);
app.put("/dispatchOrder", [isLoggedIn, hasPermission, validations.validateObjectId], dispatchOrder);
app.delete("/deleteOrder/:orderId", [isLoggedIn, hasPermission, validations.validateObjectId], deleteOrder);
app.get("/downloadInvoice/:orderId", [isLoggedIn, validations.validateObjectId], downloadInvoice);
app.post("/download/orders", [isLoggedIn, hasPermission], downloadOrders);
app.get("/searchUser/:username", [isLoggedIn, hasPermission], searchUser);

mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    createAdministrator();
  })
  .catch((error) => {
    console.log("Connection to the database could not be established!");
    console.log(error);
  });

http.listen(process.env.SERVER_PORT, () => {
  console.log(`MyShop listening on ${process.env.BASE_URL}${process.env.SERVER_PORT}!`);
});
