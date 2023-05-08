import { useState } from "react";
import { getImage, formatPrice } from "../../utilities/scripts";
import Modal from "../modals/Modal";
import Link from "../actions/Link";
import Delete from "../actions/Delete";
import Rating from "../reviews/Rating";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import style from "./Products.module.css";

const ProductRow = (props) => {
  const product = props.product;
  const index = props.index;
  const [isDisplayed, setIsDisplayed] = useState(false);

  const completeDeletion = () => {
    props.onCompleteDeletion(product._id);
  };

  return (
    <>
      {isDisplayed && (
        <Modal image={product.primaryImage} title={product.title} onManage={() => setIsDisplayed(false)} />
      )}
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: "0px" } }}>
        <TableCell><strong>{index}</strong></TableCell>
        <TableCell className={style.title} align="right">{product.title}</TableCell>
        <TableCell align="right">{formatPrice(product.price)}</TableCell>
        <TableCell align="right">{product.quantity}</TableCell>
        <TableCell align="right">
          <Rating rating={product.rating.averageRating} disabled />
        </TableCell>
        <TableCell align="right">
          <Box src={getImage(product.primaryImage)} alt={product.title} component="img" sx={{ height: "50px", width: "50px" }} className={style.pointer} onClick={() => setIsDisplayed(true)} />
        </TableCell>
        <TableCell align="right">
          <Link page={`/product/edit/${product._id}`} />
          <Delete route={`/deleteProduct/${product._id}`} message={`Delete product ${product.title}?`} onCompleteDeletion={completeDeletion} />
        </TableCell>
      </TableRow>
    </>
  );
};

export default ProductRow;
