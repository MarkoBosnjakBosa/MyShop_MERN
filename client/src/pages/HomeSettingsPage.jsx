import { useLoaderData } from "react-router-dom";
import { checkAccess, getRequestData } from "../api/api";
import constants from "../utilities/constants";
import Navigation from "../components/navigation/Navigation";
import HomeSettings from "../components/home/HomeSettings";
import PageNotFound from "../components/pageNotFound/PageNotFound";

const HomeSettingsPage = () => {
  const data = useLoaderData();
  const { isLoggedIn, hasPermission } = data.navigation;

  return (
    <>
      {(isLoggedIn && hasPermission) ? (
        <>
          <Navigation data={data.navigation} />
          <HomeSettings homeSettings={data.homeSettings} />
        </>
      ) : (
        <PageNotFound>
          No permission!
        </PageNotFound>
      )}
    </>
  );
};

export default HomeSettingsPage;

export const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const LOGIN_DEFAULT_DATA = constants.LOGIN_DEFAULT_DATA;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  if (!isLoggedIn) return { navigation: LOGIN_DEFAULT_DATA };
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  if (!hasPermission) return { navigation: LOGIN_DEFAULT_DATA };
  const homeSettings = await getRequestData({ url: `${baseUrl}/getHomeSettings` });
  return { navigation: { isLoggedIn, hasPermission }, homeSettings };
};
