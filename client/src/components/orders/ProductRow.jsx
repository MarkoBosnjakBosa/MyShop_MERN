import { formatPrice } from "../../utilities/scripts";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import style from "./Orders.module.css";

const ProductRow = (props) => {
  const product = props.product;
  const index = props.index;

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: "0px" } }}>
      <TableCell><strong>{index}</strong></TableCell>
      <TableCell className={style.text} align="right">{product.title}</TableCell>
      <TableCell align="right">{formatPrice(product.price)}</TableCell>
      <TableCell align="right">{product.selectedQuantity}</TableCell>
      <TableCell align="right">{formatPrice(product.price * product.selectedQuantity)}</TableCell>
    </TableRow>
  );
};

export default ProductRow;
