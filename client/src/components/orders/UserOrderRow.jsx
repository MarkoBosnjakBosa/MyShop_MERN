import constants from "../../utilities/constants";
import OrderTable from "./OrderTable";
import Link from "../actions/Link";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import style from "./Orders.module.css";

const UserOrderRow = (props) => {
  const order = props.order;
  const DATE_TIME_FORMAT = constants.DATE_TIME_FORMAT;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={`${style.left} ${style.text}`}><strong>#{order.orderNumber}</strong> <i>Date: <strong>{new Date(order.date).toLocaleString("de-DE", DATE_TIME_FORMAT)}</strong></i></Typography>
        <Typography className={style.right}>Payment type: <strong>{order.paymentType}</strong></Typography>
      </AccordionSummary>
      <AccordionDetails>
        <OrderTable order={order} />
      </AccordionDetails>
      <Typography className={`${style.center} ${style.action}`}>
        {order.dispatched ? (
          <Button type="button" variant="contained" color="success" endIcon={<CheckIcon />}>Dispatched: {new Date(order.dispatched).toLocaleString("de-DE", DATE_TIME_FORMAT)}</Button>
        ) : (
          <Button type="button" variant="contained" color="error" endIcon={<ClearIcon />}>Not dispatched</Button>
        )}
        <Link page={`/order/${order._id}`} isButton />
      </Typography>
    </Accordion>
  );
};

export default UserOrderRow;
