import Navigation from "../components/navigation/Navigation";
import RegistrationForm from "../components/registration/RegistrationForm";
import FormLayout from "../components/layouts/FormLayout";

const RegistrationPage = () => {
  return (
    <>
      <Navigation />
      <FormLayout title="Register" description="Please fill out this form to create an account.">
        <RegistrationForm />
      </FormLayout>
    </>
  );
};

export default RegistrationPage;
