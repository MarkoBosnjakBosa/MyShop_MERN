import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { cartActions } from "../../store/cart-slice";
import { formatPrice } from "../../utilities/scripts";
import Rating from "../reviews/Rating";
import SelectedQuantityLayout from "../layouts/SelectedQuantityLayout";
import NotificationLayout from "../layouts/NotificationLayout";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import style from "./Products.module.css";

const ProductInformation = (props) => {
  const product = props.product;
  const isLoggedIn = props.isLoggedIn;
  const hasPermission = props.hasPermission;
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isDisplayed, setIsDisplayed] = useState(false);
  const dispatch = useDispatch();

  const addToShoppingCart = (event) => {
    event.preventDefault();
    if ((selectedQuantity > 0) && (selectedQuantity <= product.quantity)) {
      const newProduct = { _id: product._id, title: product.title, price: product.price, quantity: product.quantity, selectedQuantity, primaryImage: product.primaryImage, rating: product.rating };
      dispatch(cartActions.addProduct(newProduct));
      setSelectedQuantity(1);
      setIsDisplayed(true);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container className={style.firstRow}>
          <Grid item xs={6}>
            <div className={`${style.text} ${style.padding}`}><strong>Price: {formatPrice(product.price)}</strong></div>
          </Grid>
          <Grid item xs={6}>
            {(isLoggedIn && !hasPermission) && (
              (product.quantity) ? (
                <form onSubmit={addToShoppingCart} className={style.selectedQuantity}>
                  <SelectedQuantityLayout key={selectedQuantity} quantity={product.quantity} selectedQuantity={selectedQuantity} productId={product._id} onUpdate={(newSelectedQuantity) => setSelectedQuantity(newSelectedQuantity)} />
                  <Button type="submit" variant="contained">Add</Button>
                  <strong className={style.space}>Remaining quantity: {product.quantity}</strong>
                </form>
              ) : (
                <div className={style.padding}><strong>Sold out</strong></div>
              )
            )}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={6} className={`${style.column} ${style.text} ${style.padding} ${style.rating}`}>
            <strong>Rating</strong> 
          </Grid>
          <Grid item xs={6} className={`${style.column} ${style.padding}`}>
            <Rating rating={product.rating.averageRating} disabled />
          </Grid>
          <Grid item xs={6} className={`${style.column} ${style.text} ${style.padding}`}>
            <strong>Description</strong>
          </Grid>
          <Grid item xs={6} className={`${style.column} ${style.padding}`}>
            {product.description}
          </Grid>
          {product.technicalData.map((technicalInformation) => (
            <React.Fragment key={technicalInformation._id}>
              <Grid item xs={6} className={`${style.column} ${style.text} ${style.padding}`}>
                <strong>{technicalInformation.title}</strong>
              </Grid>
              <Grid item xs={6} className={`${style.column} ${style.padding}`}>
                {technicalInformation.value}
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Box>
      {isDisplayed && (
        <NotificationLayout onClose={() => setIsDisplayed(false)}>
          The product has been successfully added to your cart.
        </NotificationLayout>
      )}
    </>
  );
};

export default ProductInformation;
