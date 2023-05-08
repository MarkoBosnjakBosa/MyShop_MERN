import { getUserData } from "../../utilities/authentication";
import { sendRequestData } from "../../api/api";
import Button from "@mui/material/Button";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import style from "./Actions.module.css";

const Dispatch = (props) => {
  const orderId = props.orderId;
  const orderNumber = props.orderNumber;
  const isButton = props.isButton;
  const { token } = getUserData();

  const dispatch = async () => {
    const confirmed = window.confirm(`Dispatch order #${orderNumber}?`);
    if (confirmed) {
      const url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/dispatchOrder`;
      const method = "PUT";
      const headers = { Authentication: `Bearer ${token}`, "Content-Type": "application/json" };
      const body = { orderId };
      const data = { url, method, headers, body };
      const dispatched = await sendRequestData(data);
      props.onCompleteDispatch(dispatched);
    }
  };

  return (
    <>
      {isButton ? (
        <Button type="button" variant="contained" className={style.action} endIcon={<LocalShippingIcon />} onClick={dispatch}>Dispatch</Button>
      ) : (
        <LocalShippingIcon className={style.action} onClick={dispatch} />
      )}
    </>
  );
};

export default Dispatch;
