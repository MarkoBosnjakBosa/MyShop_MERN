import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { checkAccess } from "../../api/api";
import constants from "../../utilities/constants";
import Navigation from "../navigation/Navigation";
import Shop from "./Shop";
import LoaderLayout from "../layouts/LoaderLayout";

const ShopWrapper = () => {
  const [navigation, setNavigation] = useState(constants.LOGIN_DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const { categoryId } = useParams();

  useEffect(() => {
    const loadData = async () => {
      const data = await loader();
      setNavigation(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoaderLayout isLoading={isLoading} />
      ) : (
        <>
          <Navigation data={navigation} />
          <Shop key={categoryId} categoryId={categoryId} />
        </>
      )}
    </>
  );
};

export default ShopWrapper;

const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  return { isLoggedIn, hasPermission };
};
