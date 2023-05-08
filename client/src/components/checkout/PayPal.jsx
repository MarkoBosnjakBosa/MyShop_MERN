import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { cartActions } from "../../store/cart-slice";
import { getUserData } from "../../utilities/authentication";
import { sendRequestData } from "../../api/api";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPal = (props) => {
  const cartProducts = props.products;
  const { token, userId } = getUserData();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const description = "MyShop";
  const totalPrice = cartProducts.reduce((total, product) => total + (product.price * product.selectedQuantity), 0).toFixed(2);
  const amount = { currency_code: "EUR", value: totalPrice, breakdown: { item_total: { currency_code: "EUR", value: totalPrice } } };
  const items = cartProducts.map((product) => ({
    name: product.title,
    unit_amount: { currency_code: "EUR", value: product.price.toFixed(2) },
    quantity: String(product.selectedQuantity)
  }));
  const purchase_units = [{ description, amount, items }];
  const options = { "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID, currency: "EUR" };
  const products = cartProducts.map((product) => ({
    _id: product._id,
    title: product.title,
    price: product.price,
    selectedQuantity: product.selectedQuantity
  }));

  const finalize = async () => {
    const url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/createOrder`;
    const method = "POST";
    const headers = { Authentication: `Bearer ${token}`, "Content-Type": "application/json" };
    const body = { userId, paymentType: "PayPal", products, totalPrice };
    const data = { url, method, headers, body }; 
    const response = await sendRequestData(data);
    if (response.errors) {
      navigate("/payment/failed");
    } else {
      dispatch(cartActions.removeProducts());
      navigate(`/order/${response.orderId}?paid=true`);
    }
  };

  const createOrder = (data, actions) => {
    return actions.order.create({ purchase_units });
  };

  const approveOrder = async (data, actions) => {
    await actions.order.capture();
    await finalize();
  };

  return (
    <PayPalScriptProvider options={options}>
      <PayPalButtons createOrder={(data, actions) => createOrder(data, actions)} onApprove={(data, actions) => approveOrder(data, actions)} />
    </PayPalScriptProvider>
  );
};

export default PayPal;
