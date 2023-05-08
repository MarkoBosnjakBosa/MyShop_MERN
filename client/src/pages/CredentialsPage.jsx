import Navigation from "../components/navigation/Navigation";
import CredentialsForm from "../components/credentials/CredentialsForm";
import FormLayout from "../components/layouts/FormLayout";

const CredentialsPage = () => {
  return (
    <>
      <Navigation />
      <FormLayout title="Forgot credentials" description="Please check an option.">
        <CredentialsForm />
      </FormLayout>
    </>
  );
};

export default CredentialsPage;
