import { useLoaderData } from "react-router-dom";
import { checkAccess, getRequestData } from "../api/api";
import { getUserData } from "../utilities/authentication";
import constants from "../utilities/constants";
import Navigation from "../components/navigation/Navigation";
import SetupForm from "../components/profile/SetupForm";
import FormLayout from "../components/layouts/FormLayout";
import PageNotFound from "../components/pageNotFound/PageNotFound";

const SetupPage = () => {
  const data = useLoaderData();
  const { isLoggedIn } = data.navigation;

  return (
    <>
      {isLoggedIn ? (
        <>
          <Navigation data={data.navigation} />
          <FormLayout title="Authentication setup" description="Manage your authentication.">
            <SetupForm authenticationEnabled={data.authenticationEnabled} />
          </FormLayout>
        </>
      ) : (
        <PageNotFound>
          No permission!
        </PageNotFound>
      )}
    </>
  );
};

export default SetupPage;

export const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  if (!isLoggedIn) return { navigation: constants.LOGIN_DEFAULT_DATA };
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  const { token, userId } = getUserData();
  const authenticationEnabled = await getRequestData({ url: `${baseUrl}/getAuthentication/${userId}`, headers: { Authentication: `Bearer ${token}` } });
  return { navigation: { isLoggedIn, hasPermission }, authenticationEnabled };
};
