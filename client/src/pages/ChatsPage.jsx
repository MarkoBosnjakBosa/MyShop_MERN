import { useLoaderData } from "react-router-dom";
import { checkAccess } from "../api/api";
import constants from "../utilities/constants";
import Navigation from "../components/navigation/Navigation";
import Chats from "../components/chats/Chats";
import PageNotFound from "../components/pageNotFound/PageNotFound";

const ChatsPage = () => {
  const data = useLoaderData();
  const { isLoggedIn, hasPermission } = data.navigation;

  return (
    <>
      {(isLoggedIn && hasPermission) ? (
        <>
          <Navigation data={data.navigation} />
          <Chats hasPermission={hasPermission} />
        </>
      ) : (
        <PageNotFound>
          No permission!
        </PageNotFound>
      )}
    </>
  );
};

export default ChatsPage;

export const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const LOGIN_DEFAULT_DATA = constants.LOGIN_DEFAULT_DATA;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  if (!isLoggedIn) return { navigation: LOGIN_DEFAULT_DATA };
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  if (!hasPermission) return { navigation: LOGIN_DEFAULT_DATA };
  return { navigation: { isLoggedIn, hasPermission } };
};
