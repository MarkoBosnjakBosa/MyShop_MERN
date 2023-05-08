import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utilities/scripts";
import constants from "../../utilities/constants";
import Link from "../actions/Link";
import Download from "../actions/Download";
import Dispatch from "../actions/Dispatch";
import Delete from "../actions/Delete";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import style from "./Orders.module.css";

const OrderRow = (props) => {
  const order = props.order;
  const index = props.index;
  const navigate = useNavigate();
  const DATE_TIME_FORMAT = constants.DATE_TIME_FORMAT;

  const completeDispatch = (dispatched) => {
    props.onCompleteDispatch(order._id, dispatched);
  };

  const completeDeletion = () => {
    props.onCompleteDeletion(order._id);
  };

  const openUser = () => {
    navigate(`/user/${order.userId}`);
  };

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: "0px" } }}>
      <TableCell><strong>{index}</strong></TableCell>
      <TableCell align="right"><strong>#{order.orderNumber}</strong></TableCell>
      <TableCell align="right">{order.user.account.firstName} {order.user.account.lastName}</TableCell>
      <TableCell align="right">
        <i className={style.link} onClick={openUser}>{order.user.account.username}</i>
      </TableCell>
      <TableCell align="right">{order.paymentType}</TableCell>
      <TableCell align="right">{formatPrice(order.totalPrice)}</TableCell>
      <TableCell align="right">{new Date(order.date).toLocaleString("de-DE", DATE_TIME_FORMAT)}</TableCell>
      <TableCell align="right">
        {order.dispatched ? (
          <Chip label={`${new Date(order.dispatched).toLocaleString("de-DE", DATE_TIME_FORMAT)}`} color="success" />
        ) : (
          <Chip label="Not dispatched" color="error" />
        )}
      </TableCell>
      <TableCell align="right">
        <Link page={`/order/${order._id}`} />
        <Download route={`/downloadInvoice/${order._id}`} type={constants.PDF} />
        {!order.dispatched && (
          <Dispatch orderId={order._id} orderNumber={order.orderNumber} onCompleteDispatch={completeDispatch} />
        )}
        <Delete route={`/deleteOrder/${order._id}`} message={`Delete order #${order.orderNumber}?`} onCompleteDeletion={completeDeletion} />
      </TableCell>
    </TableRow>
  );
};

export default OrderRow;
