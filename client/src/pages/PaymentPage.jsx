import { useLoaderData } from "react-router-dom";
import { checkAccess } from "../api/api";
import constants from "../utilities/constants";
import Navigation from "../components/navigation/Navigation";
import Payment from "../components/checkout/Payment";
import PageNotFound from "../components/pageNotFound/PageNotFound";

const PaymentPage = () => {
  const data = useLoaderData();
  const { isLoggedIn, hasPermission } = data.navigation;

  return (
    <>
      {(isLoggedIn && !hasPermission) ? (
        <>
          <Navigation data={data.navigation} />
          <Payment />
        </>
      ) : (
        <PageNotFound>
          No permission!
        </PageNotFound>
      )}
    </>
  );
};

export default PaymentPage;

export const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  if (!isLoggedIn) return { navigation: constants.LOGIN_DEFAULT_DATA };
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  return { navigation: { isLoggedIn, hasPermission } };
};
