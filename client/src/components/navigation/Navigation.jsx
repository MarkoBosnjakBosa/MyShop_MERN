import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { cartActions } from "../../store/cart-slice";
import { getUserData } from "../../utilities/authentication";
import { logout } from "../../utilities/authentication";
import constants from "../../utilities/constants";
import TopNavigation from "./TopNavigation";
import LeftNavigation from "./LeftNavigation";

const Navigation = (props) => {
  const LOGIN_DEFAULT_DATA = constants.LOGIN_DEFAULT_DATA;
  const isLoggedIn = props?.data?.isLoggedIn ? props.data.isLoggedIn : LOGIN_DEFAULT_DATA.isLoggedIn;
  const hasPermission = props?.data?.hasPermission ? props.data.hasPermission : LOGIN_DEFAULT_DATA.hasPermission;
  const avatar = props.avatar;
  const { username } = getUserData();
  const data = { isLoggedIn, hasPermission, username };
  const [leftNavigationOpen, setLeftNavigationOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openPage = (page) => {
    navigate(page);
  };

  const toggleLeftNavigation = (type, event) => {
    if ((event.type === "keydown") && ((event.key === "Tab") || (event.key === "Shift"))) {
      return;
    }
    setLeftNavigationOpen(type);
  };

  const logoutUser = () => {
    dispatch(cartActions.removeProducts());
    logout();
    navigate("/login");
  };

  return (
    <>
      <TopNavigation data={data} avatar={avatar} onOpenPage={openPage} onToggleLeftNavigation={toggleLeftNavigation} onLogout={logoutUser} />
      {leftNavigationOpen && (<LeftNavigation data={data} onToggleLeftNavigation={toggleLeftNavigation} />)}
    </>
  );
};

export default Navigation;
