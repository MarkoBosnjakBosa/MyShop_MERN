import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { checkAccess } from "../../api/api";
import constants from "../../utilities/constants";
import Navigation from "../navigation/Navigation";
import Product from "./Product";
import ViewProduct from "./ViewProduct";
import PageNotFound from "../pageNotFound/PageNotFound";
import LoaderLayout from "../layouts/LoaderLayout";

const ProductWrapper = () => {
  const [navigation, setNavigation] = useState(constants.LOGIN_DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const { type, productId } = useParams();
  const CREATE_PRODUCT = constants.CREATE_PRODUCT;
  const EDIT_PRODUCT = constants.EDIT_PRODUCT;
  const VIEW_PRODUCT = constants.VIEW_PRODUCT;

  useEffect(() => {
    const loadData = async () => {
      const data = await loader();
      setNavigation(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoaderLayout isLoading={isLoading} />
      ) : (
        ((type === CREATE_PRODUCT) || (type === EDIT_PRODUCT)) ? (
          (navigation.isLoggedIn && navigation.hasPermission) ? (
            <>
              <Navigation data={navigation} />
              <Product key={productId || CREATE_PRODUCT} type={type} productId={productId} />
            </>
          ) : (
            <PageNotFound>No permission!</PageNotFound>
          )
        ) : (type === VIEW_PRODUCT) ? (
          <>
            <Navigation data={navigation} />
            <ViewProduct key={productId} productId={productId} isLoggedIn={navigation.isLoggedIn} hasPermission={navigation.hasPermission} />
          </>
        ) : (
          <PageNotFound>Page not found!</PageNotFound>
        )
      )}
    </>
  );
};

export default ProductWrapper;

const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  return { isLoggedIn, hasPermission };
};
