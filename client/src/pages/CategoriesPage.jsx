import { useLoaderData } from "react-router-dom";
import { checkAccess, getCategories } from "../api/api";
import constants from "../utilities/constants";
import Navigation from "../components/navigation/Navigation";
import Categories from "../components/categories/Categories";
import PageNotFound from "../components/pageNotFound/PageNotFound";

const CategoriesPage = () => {
  const data = useLoaderData();
  const { isLoggedIn, hasPermission } = data.navigation;

  return (
    <>
      {(isLoggedIn && hasPermission) ? (
        <>
          <Navigation data={data.navigation} />
          <Categories categories={data.categories} />
        </>
      ) : (
        <PageNotFound>
          No permission!
        </PageNotFound>
      )}
    </>
  );
};

export default CategoriesPage;

export const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const LOGIN_DEFAULT_DATA = constants.LOGIN_DEFAULT_DATA;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  if (!isLoggedIn) return { navigation: LOGIN_DEFAULT_DATA };
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  if (!hasPermission) return { navigation: LOGIN_DEFAULT_DATA };
  const categories = await getCategories(`${baseUrl}/getCategories`);
  return { navigation: { isLoggedIn, hasPermission }, categories };
};
