import { useLoaderData } from "react-router-dom";
import { checkAccess, sendRequestData } from "../api/api";
import { getUserData } from "../utilities/authentication";
import constants from "../utilities/constants";
import Navigation from "../components/navigation/Navigation";
import UserOrders from "../components/orders/UserOrders";
import PageNotFound from "../components/pageNotFound/PageNotFound";

const UserOrdersPage = () => {
  const data = useLoaderData();
  const { isLoggedIn } = data.navigation;

  return (
    <>
      {isLoggedIn ? (
        <>
          <Navigation data={data.navigation} />
          <UserOrders data={data.orders} />
        </>
      ) : (
        <PageNotFound>
          No permission!
        </PageNotFound>
      )}
    </>
  );
};

export default UserOrdersPage;

export const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const LOGIN_DEFAULT_DATA = constants.LOGIN_DEFAULT_DATA;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  if (!isLoggedIn) return { navigation: LOGIN_DEFAULT_DATA };
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  const { token, userId } = getUserData();
  const body = { userId, page: 1 };
  const ordersData = await sendRequestData({ url: `${baseUrl}/getUserOrders`, method: "POST", headers: { Authentication: `Bearer ${token}`, "Content-Type": "application/json" }, body });
  return { navigation: { isLoggedIn, hasPermission }, orders: ordersData };
};
