import { useSelector } from "react-redux";
import Chip from "@mui/material/Chip";
import style from "./Cart.module.css";

const TotalQuantity = () => {
  const products = useSelector((state) => state.cart.products);
  const totalQuantity = products.reduce((total, product) => total + product.selectedQuantity, 0);

  return (
    <Chip label={totalQuantity} className={style.pointer} />
  );
};

export default TotalQuantity;
