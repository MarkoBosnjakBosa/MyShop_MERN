import { useState } from "react";
import useHttp from "../../hooks/use-http";
import { getUserData } from "../../utilities/authentication";
import constants from "../../utilities/constants";
import Query from "../query/Query";
import UserRow from "./UserRow";
import TableLayout from "../layouts/TableLayout";
import EmptyValuesLayout from "../layouts/EmptyValuesLayout";
import style from "./Users.module.css";

const Users = (props) => {
  const data = props.data;
  const { token } = getUserData();
  const [users, setUsers] = useState(data.users);
  const [total, setTotal] = useState(data.total);
  const [pagesNumber, setPagesNumber] = useState(data.pagesNumber);

  const { isLoading, sendRequest } = useHttp();

  const completeLoading = (data) => {
    const { users, total, pagesNumber } = data;
    setUsers(users);
    setTotal(total);
    setPagesNumber(pagesNumber);
  };

  const loadUsers = (data) => {
    const { search, page, limit } = data;
    const orderBy = data.orderBy.value;

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/getUsers`,
        method: "POST",
        headers: { Authentication: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ search, page, limit, orderBy })
      },
      completeLoading
    );
  };

  const completeDeletion = (userId) => {
    setUsers((previousUsers) => {
      const updatedUsers = previousUsers.filter((user) => user._id !== userId);
      return [...updatedUsers];
    });
    setTotal((previousTotal) => {
      return --previousTotal;
    });
  };

  return (
    <div className={`${style.users} ${style.position}`}>
      <h1 className={style.center}>Users</h1>
      <Query type={constants.USERS_PAGE} total={total} pagesNumber={pagesNumber} isLoading={isLoading} onLoadValues={loadUsers}>
        {users.length ? (
          <TableLayout labels={constants.USERS_LABELS}>
            {users.map((user, index) => (
              <UserRow key={user._id} user={user} index={++index} onCompleteDeletion={completeDeletion} />
            ))}
          </TableLayout>
        ) : (
          <EmptyValuesLayout message="No users found!" />
        )}
      </Query>
    </div>
  );
};

export default Users;
