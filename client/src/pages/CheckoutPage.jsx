import { useLoaderData } from "react-router-dom";
import { checkAccess, getRequestData } from "../api/api";
import { getUserData } from "../utilities/authentication";
import { validStreet, validHouseNumber, validCity, validZipCode, validCountry } from "../utilities/validations";
import constants from "../utilities/constants";
import Navigation from "../components/navigation/Navigation";
import Checkout from "../components/checkout/Checkout";
import PageNotFound from "../components/pageNotFound/PageNotFound";

const CheckoutPage = () => {
  const data = useLoaderData();
  const { navigation, hasAddress } = data;
  const { isLoggedIn, hasPermission } = navigation;

  return (
    <>
      {(isLoggedIn && !hasPermission && hasAddress) ? (
        <>
          <Navigation data={data.navigation} />
          <Checkout />
        </>
      ) : ((isLoggedIn && !hasPermission && !hasAddress) ? (
        <PageNotFound>
          No address specified!
        </PageNotFound>
      ) : (
        <PageNotFound>
          No permission!
        </PageNotFound>
      ))}
    </>
  );
};

export default CheckoutPage;

export const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  if (!isLoggedIn) return { navigation: constants.LOGIN_DEFAULT_DATA };
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  const { token, userId } = getUserData();
  const { address } = await getRequestData({ url: `${baseUrl}/getProfile/${userId}`, headers: { Authentication: `Bearer ${token}` } });
  const { street, houseNumber, city, zipCode, country } = address;
  if (validStreet(street) && validHouseNumber(houseNumber) && validCity(city) && validZipCode(zipCode) && validCountry(country)) {
    return { navigation: { isLoggedIn, hasPermission }, hasAddress: true };
  } else {
    return { navigation: { isLoggedIn, hasPermission }, hasAddress: false };
  }
};
