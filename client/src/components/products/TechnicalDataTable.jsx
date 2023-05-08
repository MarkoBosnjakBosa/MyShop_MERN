import constants from "../../utilities/constants";
import TechnicalInformationRow from "./TechnicalInformationRow";
import SelectLayout from "../layouts/SelectLayout";
import TableLayout from "../layouts/TableLayout";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

const TechnicalDataTable = (props) => {
  const technicalInformation = props.technicalInformation;
  const availableTechnicalData = props.availableTechnicalData;
  const technicalData = props.technicalData;

  const changeTechnicalInformation = (value) => {
    props.onChange(value);
  };

  const addTechnicalInformation = () => {
    props.onAdd();
  };

  const updateTechnicalInformation = (technicalInformationId, value) => {
    props.onUpdate(technicalInformationId, value);
  };

  const removeTechnicalInformation = (technicalInformationId) => {
    props.onRemove(technicalInformationId);
  };

  return (
    <>
      <SelectLayout value={technicalInformation} options={availableTechnicalData} label="Technical data" onChange={changeTechnicalInformation} />
      <Button type="submit" variant="contained" endIcon={<AddIcon />} onClick={addTechnicalInformation} disabled={technicalInformation ? false : true}>Add</Button>
      <hr />
      {(technicalData.length > 0) && (
        <TableLayout labels={constants.TECHNICAL_DATA_PRODUCT_LABELS}>
          {technicalData.map((technicalInformation, index) => (
            <TechnicalInformationRow key={technicalInformation._id} technicalInformation={technicalInformation} index={++index} onChange={updateTechnicalInformation} onRemove={removeTechnicalInformation} />
          ))}
        </TableLayout>
      )}
    </>
  );
};

export default TechnicalDataTable;
