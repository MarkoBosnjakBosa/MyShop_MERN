const CONFIRMATION_EMAIL_EVENT = "sendConfirmationEmail";

const RESET_PASSWORD_EMAIL_EVENT = "sendResetPasswordEmail";

const USERNAME_EMAIL_EVENT = "sendUsernameEmail";

const INVOICE_EMAIL_EVENT = "sendInvoiceEmail";

const ORDER_DISPATCHED_EMAIL_EVENT = "sendOrderDispatchedEmail";

const CONTACT_EMAIL_EVENT = "sendContactEmail";

const AUTHENTICATION_TOKEN_SMS_EVENT = "sendAuthenticationToken";

const AUTHENTICATION_ENABLING_TOKEN_SMS_EVENT = "sendAuthenticationEnablingToken";

const CONFIRMATION_TOKEN = "confirmationToken";

const AUTHENTICATION_TOKEN = "authenticationToken";

const RESET_PASSWORD_TOKEN = "resetPasswordToken";

const AUTHENTICATION_ENABLING_TOKEN = "authenticationEnablingToken";

const PRODUCTS = "products";

const ORDERS = "orders";

const USERS = "users";

const CONTACTS = "contacts";

const CSV_PRODUCTS = "Products";

const CSV_ORDERS = "Orders";

const PRODUCTS_FIELDS = ["_id", "title", "price", "quantity", "category", "description"];

const ORDERS_FIELDS = ["_id", "orderNumber", "userId", "paymentType", "totalPrice", "date", "dispatched"];

const constants = {
  CONFIRMATION_EMAIL_EVENT,
  RESET_PASSWORD_EMAIL_EVENT,
  USERNAME_EMAIL_EVENT,
  INVOICE_EMAIL_EVENT,
  ORDER_DISPATCHED_EMAIL_EVENT,
  CONTACT_EMAIL_EVENT,
  AUTHENTICATION_TOKEN_SMS_EVENT,
  AUTHENTICATION_ENABLING_TOKEN_SMS_EVENT,
  CONFIRMATION_TOKEN,
  AUTHENTICATION_TOKEN,
  RESET_PASSWORD_TOKEN,
  AUTHENTICATION_ENABLING_TOKEN,
  PRODUCTS,
  ORDERS,
  USERS,
  CONTACTS,
  CSV_PRODUCTS,
  CSV_ORDERS,
  PRODUCTS_FIELDS,
  ORDERS_FIELDS
};

export default constants;
