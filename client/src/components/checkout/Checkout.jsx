import { useSelector } from "react-redux";
import { formatPrice } from "../../utilities/scripts";
import Stripe from "./Stripe";
import PayPal from "./PayPal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import style from "./Checkout.module.css";

const Checkout = () => {
  const products = useSelector((state) => state.cart.products);
  const totalPrice = products.reduce((total, product) => total + (product.price * product.selectedQuantity), 0);

  return (
    <div className={style.checkout}>
      <h1>Checkout: {formatPrice(totalPrice)}</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Stripe products={products} />
          </Grid>
          <Grid item xs={6}>
            <PayPal products={products} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Checkout;
