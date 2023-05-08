import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../utilities/authentication";
import { getRequestData } from "../../api/api";
import { validObject } from "../../utilities/validations";
import Delete from "../actions/Delete";
import AccountLayout from "../layouts/AccountLayout";
import AddressLayout from "../layouts/AddressLayout";
import LoaderLayout from "../layouts/LoaderLayout";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import style from "./Users.module.css";

const User = (props) => {
  const selectedUserId = props.userId;
  const [account, setAccount] = useState({});
  const [address, setAddress] = useState({});
  const [tab, setTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const user = await loader(selectedUserId);
      if (validObject(user)) {
        const { account, address } = user;
        setAccount(account);
        setAddress(address);
        setIsLoading(false);
      } else {
        navigate("/users");
      }
    };
    loadData();
  }, [selectedUserId, navigate]);

  const completeDeletion = () => {
    navigate("/users");
  };

  return (
    <>
      {isLoading ? (
        <LoaderLayout isLoading={isLoading} />
      ) : (
        <div className={`${style.user} ${style.position}`}>
          <h1 className={style.center}>User: {account.username}</h1>
          {(tab === 0) && (
            <>
              <AccountLayout account={account} />
              <Button type="button" variant="contained" color="secondary" className={`${style.right} ${style.action}`} endIcon={<ArrowForwardIosIcon />} onClick={() => setTab(1)}>Address</Button>
            </>
          )}
          {(tab === 1) && (
            <>
              <AddressLayout address={address} />
              <Button type="button" variant="contained" color="secondary" className={style.action} startIcon={<ArrowBackIosIcon />} onClick={() => setTab(0)}>Account</Button>
              <span className={`${style.right} ${style.action}`}>
                <Delete route={`/deleteUser/${selectedUserId}`} message={`Delete user ${account.username}?`} isButton onCompleteDeletion={completeDeletion} />
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default User;

const loader = async (selectedUserId) => {
  const { token } = getUserData();
  return await getRequestData({ url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/getUser/${selectedUserId}`, headers: { Authentication: `Bearer ${token}` } });
};
