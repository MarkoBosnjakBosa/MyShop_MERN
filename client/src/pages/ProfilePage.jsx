import { useLoaderData } from "react-router-dom";
import { checkAccess, getRequestData } from "../api/api";
import { getUserData } from "../utilities/authentication";
import constants from "../utilities/constants";
import Navigation from "../components/navigation/Navigation";
import Profile from "../components/profile/Profile";
import FormLayout from "../components/layouts/FormLayout";
import PageNotFound from "../components/pageNotFound/PageNotFound";

const ProfilePage = () => {
  const data = useLoaderData();
  const { isLoggedIn } = data.navigation;

  return (
    <>
      {isLoggedIn ? (
        <>
          <Navigation data={data.navigation} />
          <FormLayout title="Profile" description="Edit your profile's information.">
            <Profile data={data.profile} />
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

export default ProfilePage;

export const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  if (!isLoggedIn) return { navigation: constants.LOGIN_DEFAULT_DATA };
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  const { token, userId } = getUserData();
  const { account, address } = await getRequestData({ url: `${baseUrl}/getProfile/${userId}`, headers: { Authentication: `Bearer ${token}` } });
  return { navigation: { isLoggedIn, hasPermission }, profile: { account, address } };
};
