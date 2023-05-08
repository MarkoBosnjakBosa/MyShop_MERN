import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import HomePage, { loader as homeLoader } from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import ConfirmationPage, { loader as confirmationLoader } from "./pages/ConfirmationPage";
import ConfirmationError from "./components/registration/ConfirmationError";
import LoginPage, { loader as loginLoader } from "./pages/LoginPage";
import AuthenticationPage, { loader as authenticationLoader } from "./pages/AuthenticationPage";
import CredentialsPage from "./pages/CredentialsPage";
import ResetPasswordPage, { loader as resetPasswordLoader } from "./pages/ResetPasswordPage";
import SetupPage, { loader as setupLoader } from "./pages/SetupPage";
import ProfilePage, { loader as profileLoader } from "./pages/ProfilePage";
import AvatarPage, { loader as avatarLoader } from "./pages/AvatarPage";
import CategoriesPage, { loader as categoriesLoader } from "./pages/CategoriesPage";
import TechnicalDataPage, { loader as technicalDataLoader } from "./pages/TechnicalDataPage";
import ProductsPage, { loader as productsLoader } from "./pages/ProductsPage";
import ProductWrapper from "./components/products/ProductWrapper";
import ShopWrapper from "./components/shop/ShopWrapper";
import HomeSettingsPage, { loader as homeSettingsLoader } from "./pages/HomeSettingsPage";
import ContactPage, { loader as contactLoader } from "./pages/ContactPage";
import ContactSettingsPage, { loader as contactSettingsLoader } from "./pages/ContactSettingsPage";
import ContactsPage, { loader as contactsLoader } from "./pages/ContactsPage";
import UsersPage, { loader as usersLoader } from "./pages/UsersPage";
import UserWrapper from "./components/users/UserWrapper";
import CartPage, { loader as cartLoader } from "./pages/CartPage";
import CheckoutPage, { loader as checkoutLoader } from "./pages/CheckoutPage";
import PaymentPage, { loader as paymentLoader } from "./pages/PaymentPage";
import OrdersPage, { loader as ordersLoader } from "./pages/OrdersPage";
import UserOrdersPage, { loader as userOrdersLoader } from "./pages/UserOrdersPage";
import OrderWrapper from "./components/orders/OrderWrapper";
import ChatsPage, { loader as chatsLoader } from "./pages/ChatsPage";
import ChatWrapper from "./components/chats/ChatWrapper"; 
import PageNotFound from "./components/pageNotFound/PageNotFound";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<HomePage />} loader={homeLoader} />
      <Route path="/home" element={<HomePage />} loader={homeLoader} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/confirmation" element={<ConfirmationPage />} loader={confirmationLoader} errorElement={<ConfirmationError />} />
      <Route path="/login" element={<LoginPage />} loader={loginLoader} />
      <Route path="/authentication" element={<AuthenticationPage />} loader={authenticationLoader} />
      <Route path="/credentials" element={<CredentialsPage />} />
      <Route path="/reset/password" element={<ResetPasswordPage />} loader={resetPasswordLoader} />
      <Route path="/setup" element={<SetupPage />} loader={setupLoader} />
      <Route path="/profile" element={<ProfilePage />} loader={profileLoader} />
      <Route path="/avatar" element={<AvatarPage />} loader={avatarLoader} />
      <Route path="/categories" element={<CategoriesPage />} loader={categoriesLoader} />
      <Route path="/technical/data" element={<TechnicalDataPage />} loader={technicalDataLoader} />
      <Route path="/products" element={<ProductsPage />} loader={productsLoader} />
      <Route path="/product/:type" element={<ProductWrapper />} />
      <Route path="/product/:type/:productId" element={<ProductWrapper />} />
      <Route path="/shop" element={<ShopWrapper />} />
      <Route path="/shop/:categoryId" element={<ShopWrapper />} />
      <Route path="/home/settings" element={<HomeSettingsPage />} loader={homeSettingsLoader} />
      <Route path="/contact" element={<ContactPage />} loader={contactLoader} />
      <Route path="/contact/settings" element={<ContactSettingsPage />} loader={contactSettingsLoader} />
      <Route path="/contacts" element={<ContactsPage />} loader={contactsLoader} />
      <Route path="/users" element={<UsersPage />} loader={usersLoader} />
      <Route path="/user/:userId" element={<UserWrapper />} />
      <Route path="/cart" element={<CartPage />} loader={cartLoader} />
      <Route path="/checkout" element={<CheckoutPage />} loader={checkoutLoader} />
      <Route path="/payment" element={<PaymentPage />} loader={paymentLoader} />
      <Route path="/payment/failed" element={<PageNotFound>Something went wrong!<br /> Please contact the administrators!</PageNotFound>} />
      <Route path="/orders" element={<OrdersPage />} loader={ordersLoader} />
      <Route path="/user/orders" element={<UserOrdersPage />} loader={userOrdersLoader} />
      <Route path="/order/:orderId" element={<OrderWrapper />} />
      <Route path="/chats" element={<ChatsPage />} loader={chatsLoader} />
      <Route path="/chat/:chatId" element={<ChatWrapper />} />
      <Route path="/*" element={<PageNotFound>Page not found!</PageNotFound>} />
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
