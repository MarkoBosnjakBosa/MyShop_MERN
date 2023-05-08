import { useLoaderData } from "react-router-dom";
import { checkAccess, sendRequestData, getCategories } from "../api/api";
import constants from "../utilities/constants";
import Navigation from "../components/navigation/Navigation";
import Products from "../components/products/Products";
import PageNotFound from "../components/pageNotFound/PageNotFound";

const ProductsPage = () => {
  const data = useLoaderData();
  const { isLoggedIn, hasPermission } = data.navigation;

  return (
    <>
      {(isLoggedIn && hasPermission) ? (
        <>
          <Navigation data={data.navigation} />
          <Products data={data.products} />
        </>
      ) : (
        <PageNotFound>
          No permission!
        </PageNotFound>
      )}
    </>
  );
};

export default ProductsPage;

export const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const LOGIN_DEFAULT_DATA = constants.LOGIN_DEFAULT_DATA;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  if (!isLoggedIn) return { navigation: LOGIN_DEFAULT_DATA };
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  if (!hasPermission) return { navigation: LOGIN_DEFAULT_DATA };
  const categories = await getCategories(`${baseUrl}/getCategories`);
  const body = { search: "", categoryId: "", page: 1, limit: 10, orderBy: "" };
  const productsData = await sendRequestData({ url: `${baseUrl}/getProducts`, method: "POST", headers: { "Content-Type": "application/json" }, body });
  return { navigation: { isLoggedIn, hasPermission }, products: { data: productsData, categories } };
};
