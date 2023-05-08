import { useLoaderData } from "react-router-dom";
import { checkAccess, getRequestData } from "../api/api";
import { getUserData } from "../utilities/authentication";
import Navigation from "../components/navigation/Navigation";
import Contact from "../components/contacts/Contact";
import Message from "../components/contacts/Message";

const ContactPage = () => {
  const data = useLoaderData();
  const { isLoggedIn, hasPermission } = data.navigation;

  return (
    <>
      <Navigation data={data.navigation} />
      <Contact contactSettings={data.contactSettings} account={data.account} />
      {(isLoggedIn && !hasPermission) && (
        <Message mobileNumber={data.contactSettings.mobileNumber} />
      )}
    </>
  );
};

export default ContactPage;

export const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  const contactSettings = await getRequestData({ url: `${baseUrl}/getContactSettings` });
  let account = {};
  if (isLoggedIn) {
    const { token, userId } = getUserData();
    const profile = await getRequestData({ url: `${baseUrl}/getProfile/${userId}`, headers: { Authentication: `Bearer ${token}` } });
    account = profile.account;
  }
  return { navigation: { isLoggedIn, hasPermission }, contactSettings, account };
};
