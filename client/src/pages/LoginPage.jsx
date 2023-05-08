import { checkAccess } from "../api/api";
import Navigation from "../components/navigation/Navigation";
import LoginForm from "../components/login/LoginForm";
import FormLayout from "../components/layouts/FormLayout";

const LoginPage = () => {
  return (
    <>
      <Navigation />
      <FormLayout title="Login" description="Please fill out this form to log in.">
        <LoginForm />
      </FormLayout>
    </>
  );
};

export default LoginPage;

export const loader = async () => {
  const isLoggedIn = await checkAccess(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/checkAuthentication`);
  if (isLoggedIn) {
    window.open(`${window.location.origin}/home`, "_self");
  }
  return true;
};
