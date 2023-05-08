import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { checkAccess } from "../../api/api";
import constants from "../../utilities/constants";
import Navigation from "../navigation/Navigation";
import User from "./User";
import LoaderLayout from "../layouts/LoaderLayout";

const UserWrapper = () => {
  const [navigation, setNavigation] = useState(constants.LOGIN_DEFAULT_DATA);
  const [isLoading, setisLoading] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    const loadData = async () => {
      const data = await loader();
      setNavigation(data);
      setisLoading(false);
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
          <User key={userId} userId={userId} />
        </>
      )}
    </>
  );
};

export default UserWrapper;

const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  return { isLoggedIn, hasPermission };
};
