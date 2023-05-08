import TextLayout from "./TextLayout";
import CreateIcon from "@mui/icons-material/Create";

const AddressLayout = (props) => {
  const address = props.address;

  return (
    <>
      <TextLayout type="text" value={address.street} label="Street" disabled>
        <CreateIcon />
      </TextLayout>
      <TextLayout type="text" value={address.houseNumber} label="House number" disabled>
        <CreateIcon />
      </TextLayout>
      <TextLayout type="text" value={address.city} label="City" disabled>
        <CreateIcon />
      </TextLayout>
      <TextLayout type="text" value={address.zipCode} label="ZIP code" disabled>
        <CreateIcon />
      </TextLayout>
      <TextLayout type="text" value={address.country} label="Country" disabled>
        <CreateIcon />
      </TextLayout>
    </>
  );
};

export default AddressLayout;
