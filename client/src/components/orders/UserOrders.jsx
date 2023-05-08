import { useState } from "react";
import { getUserData } from "../../utilities/authentication";
import { sendRequestData } from "../../api/api";
import UserOrderRow from "./UserOrderRow";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import style from "./Orders.module.css";

const UserOrders = (props) => {
  const data = props.data;
  const { token, userId } = getUserData();
  const [orders, setOrders] = useState(data.orders);
  const [total, setTotal] = useState(data.total);
  const [pagesNumber, setPagesNumber] = useState(data.pagesNumber);
  const [page, setPage] = useState(1);

  const loadOrders = async (page) => {
    const url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/getUserOrders`;
    const method = "POST";
    const headers = { Authentication: `Bearer ${token}`, "Content-Type": "application/json" };
    const body = { userId, page };
    const data = { url, method, headers, body };
    const response = await sendRequestData(data);
    const { orders, total, pagesNumber } = response;
    setOrders(orders);
    setTotal(total);
    setPagesNumber(pagesNumber);
    setPage(page);
  };

  return (
    <div className={`${style.order} ${style.position}`}>
      <h1 className={style.center}>Orders</h1>
      <p className={style.center}><strong>Total: {total}</strong></p>
      {orders.map((order) =>
        <UserOrderRow key={order._id} order={order} />
      )}
      <div className={style.center}>
        {(page - 1 > 0) && (
          <Button type="button" variant="contained" color="secondary" className={`${style.action} ${style.leftPage}`} startIcon={<ArrowBackIosIcon />} onClick={() => loadOrders(page - 1)}>{page - 1}</Button>
        )}
        <Button type="button" variant="contained" color="secondary" className={style.action}>{page}</Button>
        {(page < pagesNumber) && (
          <Button type="button" variant="contained" color="secondary" className={`${style.action} ${style.rightPage}`} endIcon={<ArrowForwardIosIcon />} onClick={() => loadOrders(page + 1)}>{page + 1}</Button>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
