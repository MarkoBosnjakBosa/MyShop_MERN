import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../../store/cart-slice";
import { getImage, formatPrice } from "../../utilities/scripts";
import Link from "../actions/Link";
import Rating from "../reviews/Rating";
import SelectedQuantityLayout from "../layouts/SelectedQuantityLayout";
import EmptyValuesLayout from "../layouts/EmptyValuesLayout";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DeleteIcon from "@mui/icons-material/Delete";
import style from "./Cart.module.css";

const Cart = () => {
  const products = useSelector((state) => state.cart.products);
  const totalPrice = products.reduce((total, product) => total + (product.price * product.selectedQuantity), 0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const updateSelectedQuantity = (productId, selectedQuantity) => {
    dispatch(cartActions.updateSelectedQuantity({ productId, selectedQuantity }));
  };

  const removeProduct = (productId, title) => {
    const confirmed = window.confirm(`Do you want to remove product ${title}?`);
    if (confirmed) {
      dispatch(cartActions.removeProduct({ productId }));
    }
  };

  const removeProducts = () => {
    const confirmed = window.confirm("Do you want to remove all products?");
    if (confirmed) {
      dispatch(cartActions.removeProducts());
    }
  };

  const openPage = (page) => {
    navigate(page);
  };

  return (
    <div className={style.cart}>
      <h1>Shopping cart</h1>
      {products.length ? (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={10}>
              {products.map((product) => (
                <React.Fragment key={product._id}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Box src={getImage(product.primaryImage)} alt={product.primaryImage.name} component="img" className={style.image} />
                    </Grid>
                    <Grid item xs={6}>
                      <h3 className={style.title}>{product.title}</h3>
                      <p>
                        <strong>Price: {formatPrice(Number(product.price))}</strong>
                      </p>
                      <p>
                        <strong>Quantity: </strong>
                        <SelectedQuantityLayout quantity={product.quantity} selectedQuantity={product.selectedQuantity} productId={product._id} onUpdate={(selectedQuantity) => updateSelectedQuantity(product._id, selectedQuantity)} />
                      </p>
                      <p>
                        <strong>Total: {formatPrice(Number(product.price) * Number(product.selectedQuantity))}</strong>
                      </p>
                      <p>
                        <Rating rating={product.rating.averageRating} disabled />
                      </p>
                      <p>
                        <Link page={`/product/view/${product._id}`} />
                        <DeleteIcon className={`${style.link} ${style.pointer}`} onClick={() => removeProduct(product._id, product.title)} />
                      </p>
                    </Grid>
                  </Grid>
                  <hr />
                </React.Fragment>
              ))}
            </Grid>
            <Grid item xs={2}>
              <strong>Total: {formatPrice(totalPrice)}</strong>
              <Button type="button" variant="contained" className={style.action} endIcon={<PaymentIcon />} onClick={() => openPage("/checkout")}>Checkout</Button>
              <Button type="button" variant="contained" color="secondary" className={style.action} endIcon={<LocalShippingIcon />} onClick={() => openPage("/profile")}>Address</Button>
              <Button type="button" variant="contained" color="error" className={style.action} endIcon={<DeleteIcon />} onClick={removeProducts}>Remove</Button>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <EmptyValuesLayout message="No products found in the shopping cart!" />
      )}
    </div>
  );
};

export default Cart;
