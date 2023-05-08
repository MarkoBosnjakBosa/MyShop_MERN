import { useState } from "react";
import useHttp from "../../hooks/use-http";
import { getUserData } from "../../utilities/authentication";
import constants from "../../utilities/constants";
import Query from "../query/Query";
import OrderRow from "./OrderRow";
import TableLayout from "../layouts/TableLayout";
import EmptyValuesLayout from "../layouts/EmptyValuesLayout";
import style from "./Orders.module.css";

const Orders = (props) => {
  const data = props.data;
  const { token } = getUserData();
  const [orders, setOrders] = useState(data.orders);
  const [total, setTotal] = useState(data.total);
  const [pagesNumber, setPagesNumber] = useState(data.pagesNumber);

  const { isLoading, sendRequest } = useHttp();

  const completeLoading = (data) => {
    const { orders, total, pagesNumber } = data;
    setOrders(orders);
    setTotal(total);
    setPagesNumber(pagesNumber);
    window.scroll(0, 0);
  };

  const loadOrders = (data) => {
    const { search, category, page, limit } = data;
    const categoryId = category._id;
    const orderBy = data.orderBy.value;
    
    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/getOrders`,
        method: "POST",
        headers: { Authentication: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ search, categoryId, page, limit, orderBy })
      },
      completeLoading
    );
  };

  const completeDispatch = (orderId, dispatched) => {
    setOrders((previousOrders) => {
      const updatedOrders = previousOrders.map((order) => {
        if (order._id === orderId) {
          order = { ...order, dispatched };
        }
        return order;
      });
      return [...updatedOrders];
    });
  };

  const completeDeletion = (orderId) => {
    setOrders((previousOrders) => {
      const updatedOrders = previousOrders.filter((order) => order._id !== orderId);
      return [...updatedOrders];
    });
    setTotal((previousTotal) => {
      return --previousTotal;
    });
  };

  return (
    <div className={`${style.settings} ${style.position}`}>
      <h1 className={style.center}>Orders</h1>
      <Query type={constants.ORDERS_PAGE} categories={constants.ORDERS_CATEGORIES} total={total} pagesNumber={pagesNumber} isLoading={isLoading} onLoadValues={loadOrders}>
        {orders.length ? (
          <TableLayout labels={constants.ORDERS_LABELS}>
            {orders.map((order, index) => (
              <OrderRow key={order._id} order={order} index={++index} onCompleteDispatch={completeDispatch} onCompleteDeletion={completeDeletion} />
            ))}
          </TableLayout>
        ) : (
          <EmptyValuesLayout message="No orders found!" />
        )}
      </Query>
    </div>
  );
};

export default Orders;
