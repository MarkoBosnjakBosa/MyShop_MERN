import { useLoaderData } from "react-router-dom";
import { getUserData } from "../utilities/authentication";
import AuthenticationForm from "../components/login/AuthenticationForm";
import Navigation from "../components/navigation/Navigation";
import FormLayout from "../components/layouts/FormLayout";
import PageNotFound from "../components/pageNotFound/PageNotFound";

const AuthenticationPage = () => {
  const data = useLoaderData();
  const { token, userId } = data;

  return (
    <>
      {(userId && !token) ? (
        <>
          <Navigation />
          <FormLayout title="Authentication" description="Please insert the authentication token to log in.">
            <AuthenticationForm userId={userId} />
          </FormLayout>
        </>
      ) : (
        <PageNotFound>
          You are not able to authenticate right now!
        </PageNotFound>
      )}
    </>
  );
};

export default AuthenticationPage;

export const loader = () => {
  const { token, userId } = getUserData();
  return { token, userId };
};
