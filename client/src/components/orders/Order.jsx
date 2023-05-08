import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../utilities/authentication";
import { getRequestData } from "../../api/api";
import { validObject } from "../../utilities/validations";
import constants from "../../utilities/constants";
import OrderTable from "./OrderTable";
import Dispatch from "../actions/Dispatch";
import Delete from "../actions/Delete";
import AccountLayout from "../layouts/AccountLayout";
import AddressLayout from "../layouts/AddressLayout";
import MessageLayout from "../layouts/MessageLayout";
import LoaderLayout from "../layouts/LoaderLayout";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import style from "./Orders.module.css";

const Order = (props) => {
  const orderId = props.orderId;
  const hasPermission = props.hasPermission;
  const [order, setOrder] = useState({});
  const [tab, setTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const navigate = useNavigate();
  const DATE_TIME_FORMAT = constants.DATE_TIME_FORMAT;

  useEffect(() => {
    const loadData = async () => {
      const order = await loader(orderId);
      if (validObject(order)) {
        setOrder(order);
        const searchParams = new URL(window.location.href).searchParams;
        const paid = searchParams.get("paid");
        if (paid === "true") setIsPaid(true);
        setIsLoading(false);
      } else {
        if (hasPermission) {
          navigate("/orders");
        } else {
          navigate("/user/orders");
        }
      }
    };
    loadData();
  }, [orderId, hasPermission, navigate]);

  const completeDispatch = (dispatched) => {
    setOrder((previousOrder) => {
      return { ...previousOrder, dispatched };
    });
  };

  const completeDeletion = () => {
    navigate("/orders");
  };

  return (
    <>
      {isLoading ? (
        <LoaderLayout isLoading={isLoading} />
      ) : (
        <div className={`${style.order} ${style.position}`}>
          <h1 className={style.center}>Order: #{order.orderNumber}</h1>
          {isPaid && (
            <MessageLayout type="success" closeable onClose={() => setIsPaid(false)}>
              The order <strong>#{order.orderNumber}</strong> has been successfully created!
            </MessageLayout>
          )}
          {(tab === 0) && (
            <>
              <OrderTable order={order} />
              <div className={style.action}>
                {hasPermission ? (
                  <>
                    {order.dispatched ? (
                      <Button type="button" variant="contained" color="success" endIcon={<CheckIcon />}>Dispatched: {new Date(order.dispatched).toLocaleString("de-DE", DATE_TIME_FORMAT)}</Button>
                    ) : (
                      <Dispatch orderId={orderId} orderNumber={order.orderNumber} isButton onCompleteDispatch={completeDispatch} />
                    )}
                    <Delete route={`/deleteOrder/${orderId}`} message={`Delete order #${order.orderNumber}?`} isButton onCompleteDeletion={completeDeletion} />
                  </>
                ) : (
                  order.dispatched ? (
                    <Button type="button" variant="contained" color="success" endIcon={<CheckIcon />}>Dispatched: {new Date(order.dispatched).toLocaleString("de-DE", DATE_TIME_FORMAT)}</Button>
                  ) : (
                    <Button type="button" variant="contained" color="error" endIcon={<ClearIcon />}>Not dispatched</Button>
                  )
                )}
                <Button type="button" variant="contained" color="secondary" className={style.next} endIcon={<ArrowForwardIosIcon />} onClick={() => setTab(1)}>Account</Button>
              </div>
            </>
          )}
          {(tab === 1) && (
            <div className={`${style.information} ${style.position}`}>
              <AccountLayout account={order.user.account} />
              <Button type="button" variant="contained" color="secondary" className={style.action} startIcon={<ArrowBackIosIcon />} onClick={() => setTab(0)}>Payment</Button>
              <Button type="button" variant="contained" color="secondary" className={`${style.next} ${style.action}`} endIcon={<ArrowForwardIosIcon />} onClick={() => setTab(2)}>Address</Button>
            </div>
          )}
          {(tab === 2) && (
            <div className={`${style.information} ${style.position}`}>
              <AddressLayout address={order.user.address} />
              <Button type="button" variant="contained" color="secondary" className={style.action} startIcon={<ArrowBackIosIcon />} onClick={() => setTab(1)}>Account</Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Order;

const loader = async (orderId) => {
  const { token } = getUserData();
  return await getRequestData({ url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/getOrder/${orderId}`, headers: { Authentication: `Bearer ${token}` } });
};
