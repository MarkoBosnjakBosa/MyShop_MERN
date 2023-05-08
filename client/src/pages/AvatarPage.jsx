import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { checkAccess, getRequestData } from "../api/api";
import { getUserData } from "../utilities/authentication";
import constants from "../utilities/constants";
import Navigation from "../components/navigation/Navigation";
import Avatar from "../components/profile/Avatar";
import PageNotFound from "../components/pageNotFound/PageNotFound";

const AvatarPage = () => {
  const data = useLoaderData();
  const { isLoggedIn } = data.navigation;
  const [avatar, setAvatar] = useState({});

  return (
    <>
      {isLoggedIn ? (
        <>
          <Navigation key={new Date().getTime()} data={data.navigation} avatar={avatar} />
          <Avatar avatar={data.avatar} onChange={(newAvatar) => setAvatar(newAvatar)} />
        </>
      ) : (
        <PageNotFound>
          No permission!
        </PageNotFound>
      )}
    </>
  );
};

export default AvatarPage;

export const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  if (!isLoggedIn) return { navigation: constants.LOGIN_DEFAULT_DATA };
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  const { token, userId } = getUserData();
  const avatar = await getRequestData({ url: `${baseUrl}/getAvatar/${userId}`, headers: { Authentication: `Bearer ${token}` } });
  return { navigation: { isLoggedIn, hasPermission }, avatar };
};
