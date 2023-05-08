import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../utilities/authentication";
import { sendRequestData } from "../../api/api";
import { formatStripePrice } from "../../utilities/scripts";
import Button from "@mui/material/Button";
import PaymentIcon from "@mui/icons-material/Payment";

const Stripe = (props) => {
  const products = props.products;
  const { token } = getUserData();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const createCheckoutSession = async () => {
    setIsLoading(true);
    const url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/createCheckoutSession`;
    const method = "POST";
    const headers = { Authentication: `Bearer ${token}`, "Content-Type": "application/json" };
    const line_items = products.map((product) => ({ 
      quantity: product.selectedQuantity,
      price_data: { unit_amount: formatStripePrice(product.price), currency: "eur", product_data: { name: product.title } }
    }));
    const data = { url, method, headers, body: { line_items } }; 
    const response = await sendRequestData(data);
    setIsLoading(false);
    if (response.errors) {
      navigate("/payment/failed");
    } else {
      window.open(response.sessionUrl, "_self");
    }
  };

  return (
    <Button type="button" variant="contained" endIcon={<PaymentIcon />} onClick={createCheckoutSession} disabled={isLoading}>Stripe - Credit card</Button>
  );
};

export default Stripe;
