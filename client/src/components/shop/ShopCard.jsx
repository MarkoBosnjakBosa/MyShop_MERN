import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImage, formatPrice } from "../../utilities/scripts";
import Rating from "../reviews/Rating";
import Modal from "../modals/Modal";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import style from "./Shop.module.css";

const ShopCard = (props) => {
  const product = props.product;
  const [isDisplayed, setIsDisplayed] = useState(false);
  const navigate = useNavigate();

  const openProduct = () => {
    navigate(`/product/view/${product._id}`);
  };

  return (
    <>
      {isDisplayed && (
        <Modal image={product.primaryImage} title={product.title} onManage={() => setIsDisplayed(false)} />
      )}
      <Card className={style.card}>
        <CardMedia image={getImage(product.primaryImage)} className={style.image} onClick={() => setIsDisplayed(true)} />
        <CardContent className={style.content}>
          <Typography gutterBottom variant="h5">
            <Tooltip title={product.title} placement="top">
              <>{product.title}</>
            </Tooltip>
          </Typography>
          <Typography component="div">
            <Typography component="div">Price: {formatPrice(product.price)}</Typography>
            <Rating rating={product.rating.averageRating} disabled />
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={openProduct}>View more...</Button>
        </CardActions>
      </Card>
    </>
  );
};

export default ShopCard;
