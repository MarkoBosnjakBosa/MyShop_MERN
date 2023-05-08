import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { checkAccess } from "../../api/api";
import constants from "../../utilities/constants";
import Navigation from "../navigation/Navigation";
import Chat from "./Chat";
import PageNotFound from "../pageNotFound/PageNotFound";
import LoaderLayout from "../layouts/LoaderLayout";

const ChatWrapper = () => {
  const [navigation, setNavigation] = useState(constants.LOGIN_DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const { chatId } = useParams();

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
        navigation.isLoggedIn ? (
          <>
            <Navigation data={navigation} />
            <Chat key={chatId} chatId={chatId} hasPermission={navigation.hasPermission} />
          </>
        ) : (
          <PageNotFound>No permission!</PageNotFound>
        )
      )}
    </>
  );
};

export default ChatWrapper;

const loader = async () => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
  return { isLoggedIn, hasPermission };
};
