import { useLoaderData } from "react-router-dom";
import { checkAccess, getRequestData } from "../api/api";
import Navigation from "../components/navigation/Navigation";
import Home from "../components/home/Home";

const HomePage = () => {
  const data = useLoaderData();

  return (
    <>
      <Navigation data={data.navigation} />
      <Home homeSettings={data.homeSettings} />
    </>
  );
};

export default HomePage;

export const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  const homeSettings = await getRequestData({ url: `${baseUrl}/getHomeSettings` });
  return { navigation: { isLoggedIn, hasPermission }, homeSettings };
};
