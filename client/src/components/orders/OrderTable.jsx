import { formatPrice } from "../../utilities/scripts";
import constants from "../../utilities/constants";
import ProductRow from "./ProductRow";
import Download from "../actions/Download";
import TableLayout from "../layouts/TableLayout";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

const OrderTable = (props) => {
  const order = props.order;

  return (
    <TableLayout labels={constants.ORDER_LABELS}>
      {order.products.map((product, index) => (
        <ProductRow key={product._id} product={product} index={++index} />
      ))}
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: "0px" } }}>
        <TableCell colSpan={4}><strong>Total</strong></TableCell>
        <TableCell align="right"><strong>{formatPrice(order.totalPrice)}</strong></TableCell>
      </TableRow>
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: "0px" } }}>
        <TableCell colSpan={4}><strong>Date</strong></TableCell>
        <TableCell align="right"><strong>{new Date(order.date).toLocaleString("de-DE", constants.DATE_TIME_FORMAT)}</strong></TableCell>
      </TableRow>
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: "0px" } }}>
        <TableCell colSpan={4}><strong>Download</strong></TableCell>
        <TableCell align="right">
          <Download route={`/downloadInvoice/${order._id}`} type={constants.PDF} />
        </TableCell>
      </TableRow>
    </TableLayout>
  );
};

export default OrderTable;
