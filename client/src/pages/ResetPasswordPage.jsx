import { useLoaderData } from "react-router-dom";
import { checkAccess } from "../api/api";
import constants from "../utilities/constants";
import Navigation from "../components/navigation/Navigation";
import ResetPasswordForm from "../components/credentials/ResetPasswordForm";
import FormLayout from "../components/layouts/FormLayout";

const ResetPasswordPage = () => {
  const data = useLoaderData();

  return (
    <>
      <Navigation data={data.navigation} /> 
      <FormLayout title="Reset password" description="Please insert your new password.">
        <ResetPasswordForm data={data.resetPassword} />
      </FormLayout>
    </>
  );
};

export default ResetPasswordPage;

export const loader = async ({ request }) => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const isLoggedIn = await checkAccess(`${baseUrl}/checkAuthentication`);
  if (!isLoggedIn) {
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get("userId");
    const resetPasswordToken = searchParams.get("resetPasswordToken");
    return { navigation: constants.LOGIN_DEFAULT_DATA, resetPassword: { isLoggedIn, userId, resetPasswordToken } };
  } else {
    const hasPermission = await checkAccess(`${baseUrl}/checkAuthorization`);
    return { navigation: { isLoggedIn, hasPermission }, resetPassword: { isLoggedIn } };
  }
};
