import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../../store/cart-slice";
import { getUserData } from "../../utilities/authentication";
import { sendRequestData } from "../../api/api";
import LoaderLayout from "../layouts/LoaderLayout";

const Payment = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.cart.products.map((product) => ({
    _id: product._id,
    title: product.title,
    price: product.price,
    selectedQuantity: product.selectedQuantity
  })));
  const totalPrice = products.reduce((total, product) => total + (product.price * product.selectedQuantity), 0).toFixed(2);

  useEffect(() => {
    const loadData = async () => {
      const data = await loader(products, totalPrice);
      setIsLoading(false);
      if (data.errors) {
        navigate("/payment/failed");
      } else {
        dispatch(cartActions.removeProducts());
        navigate(`/order/${data.orderId}?paid=true`);
      }
    };
    loadData();
  }, [products, totalPrice, dispatch, navigate]);

  return (
    <LoaderLayout isLoading={isLoading} />
  );
};

export default Payment;

const loader = async (products, totalPrice) => {
  const { token, userId } = getUserData();
  const url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/createOrder`;
  const method = "POST";
  const headers = { Authentication: `Bearer ${token}`, "Content-Type": "application/json" };
  const body = { userId, paymentType: "Credit card", products, totalPrice };
  const data = { url, method, headers, body }; 
  return await sendRequestData(data);
};
