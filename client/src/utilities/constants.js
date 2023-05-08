const LOGIN_DEFAULT_DATA = { isLoggedIn: false, hasPermission: false };

const SHOP_DEFAULT_LINK = { _id: "default", title: "Shop", icon: "fa-solid fa-bag-shopping" };

const NAVIGATION_LINKS = [{ title: "Products", page: "/products" }, { title: "Create product", page: "/product/create" }, { title: "Categories", page: "/categories" }, { title: "Technical data", page: "/technical/data" }, { title: "Orders", page: "/orders" }, { title: "Home settings", page: "/home/settings" }, { title: "Contact settings", page: "/contact/settings" }, { title: "Contacts", page: "/contacts" }, { title: "Users", page: "/users" }, { title: "Chats", page: "/chats" }];

const CATEGORY_DEFAULT_OPTION = { _id: "", title: "Category", icon: "" };

const ACCOUNT = "account";

const ADDRESS = "address";

const CREATE_PRODUCT = "create";

const EDIT_PRODUCT = "edit";

const VIEW_PRODUCT = "view";

const PRODUCTS_PAGE = "products";

const SHOP_PAGE = "shop";

const CONTACTS_PAGE = "contacts";

const USERS_PAGE = "users";

const ORDERS_PAGE = "orders";

const CATEGORIES_LABELS = ["Title", "Icon", "Actions"];

const TECHNICAL_DATA_LABELS = ["Title", "Actions"];

const PRODUCTS_LABELS = ["Title", "Price", "Quantity", "Rating", "Primary image", "Actions"];

const TECHNICAL_DATA_PRODUCT_LABELS = ["Title", "Value", "Actions"];

const USERS_LABELS = ["Name", "Username", "Email", "Mobile number", "Actions"];

const ORDERS_LABELS = ["Order number", "Name", "Username", "Payment type", "Total price", "Date", "Dispatched", "Actions"];

const ORDER_LABELS = ["Title", "Price", "Quantity", "Total price"];

const FORBIDDEN_NUMBER_SYMBOLS = ["e", "E", "+", "-", "."];

const ORDERS_CATEGORIES = [{ _id: "", title: "Category", value: "" }, { _id: "dispatched", title: "Dispatched", value: "dispatched" }, { _id: "notDispatched", title: "Not dispatched", value: "notDispatched" }, { _id: "creditCard", title: "Credit card", value: "creditCard" }, { _id: "payPal", title: "PayPal", value: "payPal" }];
 
const ORDER_BY_PRODUCTS_OPTIONS = [{ _id: "", title: "Order by", value: "" }, { _id: "titleAsc", title: "Title ↑", value: "titleAsc" }, { _id: "titleDesc", title: "Title ↓", value: "titleDesc" }, { _id: "priceAsc", title: "Price ↑", value: "priceAsc" }, { _id: "priceDesc", title: "Price ↓", value: "priceDesc" }, { _id: "quantityAsc", title: "Quantity ↑", value: "quantityAsc" }, { _id: "quantityDesc", title: "Quantity ↓", value: "quantityDesc" }, { _id: "ratingAsc", title: "Rating ↑", value: "ratingAsc" }, { _id: "ratingDesc", title: "Rating ↓", value: "ratingDesc" }];

const ORDER_BY_CONTACTS_OPTIONS = [{ _id: "", title: "Order by", value: "" }, { _id: "dateAsc", title: "Date ↑", value: "dateAsc" }, { _id: "dateDesc", title: "Date ↓", value: "dateDesc" }];

const ORDER_BY_USERS_OPTIONS = [{ _id: "", title: "Order by", value: "" }, { _id: "usernameAsc", title: "Username ↑", value: "usernameAsc" }, { _id: "usernameDesc", title: "Username ↓", value: "usernameDesc" }, { _id: "emailAsc", title: "Email ↑", value: "emailAsc" }, { _id: "emailDesc", title: "Email ↓", value: "emailDesc" }];

const ORDER_BY_ORDERS_OPTIONS = [{ _id: "", title: "Order by", value: "" }, { _id: "orderNumberAsc", title: "Order number ↑", value: "orderNumberAsc" }, { _id: "orderNumberDesc", title: "Order number ↓", value: "orderNumberDesc" }, { _id: "paymentTypeAsc", title: "Payment type ↑", value: "paymentTypeAsc" }, { _id: "paymentTypeDesc", title: "Payment type ↓", value: "paymentTypeDesc" }, { _id: "dateAsc", title: "Date ↑", value: "dateAsc" }, { _id: "dateDesc", title: "Date ↓", value: "dateDesc" }, { _id: "dispatchedAsc", title: "Dispatched ↑", value: "dispatchedAsc" }, { _id: "dispatchedDesc", title: "Dispatched ↓", value: "dispatchedDesc" }];

const DATE_TIME_FORMAT = { dateStyle: "medium", timeStyle: "short" };

const TIME_FORMAT = { hour: "2-digit", minute: "2-digit" };

const CSV = "csv";

const PDF = "pdf";

const VIDEO_OPTIONS = { audio: false, video: { width: 300, height: 300 } };

const constants = {
  LOGIN_DEFAULT_DATA,
  SHOP_DEFAULT_LINK,
  NAVIGATION_LINKS,
  CATEGORY_DEFAULT_OPTION,
  ACCOUNT,
  ADDRESS,
  CREATE_PRODUCT,
  EDIT_PRODUCT,
  VIEW_PRODUCT,
  PRODUCTS_PAGE,
  SHOP_PAGE,
  CONTACTS_PAGE,
  USERS_PAGE,
  ORDERS_PAGE,
  CATEGORIES_LABELS,
  TECHNICAL_DATA_LABELS,
  PRODUCTS_LABELS,
  TECHNICAL_DATA_PRODUCT_LABELS,
  USERS_LABELS,
  ORDERS_LABELS,
  ORDER_LABELS,
  FORBIDDEN_NUMBER_SYMBOLS,
  ORDERS_CATEGORIES,
  ORDER_BY_PRODUCTS_OPTIONS,
  ORDER_BY_CONTACTS_OPTIONS,
  ORDER_BY_USERS_OPTIONS,
  ORDER_BY_ORDERS_OPTIONS,
  DATE_TIME_FORMAT,
  TIME_FORMAT,
  CSV,
  PDF,
  VIDEO_OPTIONS
};

export default constants;
