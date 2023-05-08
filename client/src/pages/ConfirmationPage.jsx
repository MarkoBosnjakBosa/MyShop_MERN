import { getConfirmation } from "../api/api";
import Navigation from "../components/navigation/Navigation";
import ConfirmationSuccess from "../components/registration/ConfirmationSuccess";

const ConfirmationPage = () => {
  return (
    <>
      <Navigation />
      <ConfirmationSuccess />
    </>
  );
};

export default ConfirmationPage;

export const loader = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const userId = searchParams.get("userId");
  const confirmationToken = searchParams.get("confirmationToken");
  return await getConfirmation(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/confirmation?userId=${userId}&confirmationToken=${confirmationToken}`);
};
