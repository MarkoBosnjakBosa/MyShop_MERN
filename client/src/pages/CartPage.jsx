import { useLoaderData } from "react-router-dom";
import { checkAccess } from "../api/api";
import constants from "../utilities/constants";
import Navigation from "../components/navigation/Navigation";
import Cart from "../components/cart/Cart";
import PageNotFound from "../components/pageNotFound/PageNotFound";

const CartPage = () => {
  const data = useLoaderData();
  const { isLoggedIn, hasPermission } = data.navigation;

  return (
    <>
      {(isLoggedIn && !hasPermission) ? (
        <>
          <Navigation data={data.navigation} />
          <Cart />
        </>
      ) : (
        <PageNotFound>
          No permission!
        </PageNotFound>
      )}
    </>
  );
};

export default CartPage;

export const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  if (!isLoggedIn) return { navigation: constants.LOGIN_DEFAULT_DATA };
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  return { navigation: { isLoggedIn, hasPermission } };
};
