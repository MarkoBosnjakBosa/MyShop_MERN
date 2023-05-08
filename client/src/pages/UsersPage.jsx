import { useLoaderData } from "react-router-dom";
import { checkAccess, sendRequestData } from "../api/api";
import { getUserData } from "../utilities/authentication";
import constants from "../utilities/constants";
import Navigation from "../components/navigation/Navigation";
import Users from "../components/users/Users";
import PageNotFound from "../components/pageNotFound/PageNotFound";

const UsersPage = () => {
  const data = useLoaderData();
  const { isLoggedIn, hasPermission } = data.navigation;

  return (
    <>
      {(isLoggedIn && hasPermission) ? (
        <>
          <Navigation data={data.navigation} />
          <Users data={data.users} />
        </>
      ) : (
        <PageNotFound>
          No permission!
        </PageNotFound>
      )}
    </>
  );
};

export default UsersPage;

export const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const LOGIN_DEFAULT_DATA = constants.LOGIN_DEFAULT_DATA;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  if (!isLoggedIn) return { navigation: LOGIN_DEFAULT_DATA };
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  if (!hasPermission) return { navigation: LOGIN_DEFAULT_DATA };
  const { token } = getUserData();
  const body = { search: "", page: 1, limit: 10, orderBy: "" };
  const usersData = await sendRequestData({ url: `${baseUrl}/getUsers`, method: "POST", headers: { Authentication: `Bearer ${token}`, "Content-Type": "application/json" }, body });
  return { navigation: { isLoggedIn, hasPermission }, users: usersData };
};
