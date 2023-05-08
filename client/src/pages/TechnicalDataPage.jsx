import { useLoaderData } from "react-router-dom";
import { checkAccess, getRequestData } from "../api/api";
import { getUserData } from "../utilities/authentication";
import constants from "../utilities/constants";
import Navigation from "../components/navigation/Navigation";
import TechnicalData from "../components/technicalData/TechnicalData";
import PageNotFound from "../components/pageNotFound/PageNotFound";

const TechnicalDataPage = () => {
  const data = useLoaderData();
  const { isLoggedIn, hasPermission } = data.navigation;

  return (
    <>
      {(isLoggedIn && hasPermission) ? (
        <>
          <Navigation data={data.navigation} />
          <TechnicalData technicalData={data.technicalData} />
        </>
      ) : (
        <PageNotFound>
          No permission!
        </PageNotFound>
      )}
    </>
  );
};

export default TechnicalDataPage;

export const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const LOGIN_DEFAULT_DATA = constants.LOGIN_DEFAULT_DATA;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  if (!isLoggedIn) return { navigation: LOGIN_DEFAULT_DATA };
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  if (!hasPermission) return { navigation: LOGIN_DEFAULT_DATA };
  const { token } = getUserData();
  const technicalData = await getRequestData({ url: `${baseUrl}/getTechnicalData`, headers: { Authentication: `Bearer ${token}` } });
  return { navigation: { isLoggedIn, hasPermission }, technicalData };
};
