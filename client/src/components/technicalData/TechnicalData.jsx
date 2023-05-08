import { useState } from "react";
import constants from "../../utilities/constants";
import TechnicalDataForm from "./TechnicalDataForm";
import TechnicalInformationRow from "./TechnicalInformationRow";
import TableLayout from "../layouts/TableLayout";
import EmptyValuesLayout from "../layouts/EmptyValuesLayout";
import style from "./TechnicalData.module.css";

const TechnicalData = (props) => {
  const [technicalData, setTechnicalData] = useState(props.technicalData);

  const completeCreation = (newTechnicalInformation) => {
    setTechnicalData((previousTechnicalData) => {
      return [...previousTechnicalData, newTechnicalInformation];
    });
  };

  const completeDeletion = (technicalInformationId) => {
    setTechnicalData((previousTechnicalData) => {
      const updatedTechnicalData = previousTechnicalData.filter((technicalInformation) => technicalInformation._id !== technicalInformationId);
      return [...updatedTechnicalData];
    });
  };

  return (
    <div className={style.settings}>
      <h1 className={style.center}>Technical data</h1>
      <TechnicalDataForm onCompleteCreation={completeCreation} />
      <hr />
      {technicalData.length ? (
        <TableLayout labels={constants.TECHNICAL_DATA_LABELS}>
          {technicalData.map((technicalInformation, index) => (
            <TechnicalInformationRow key={technicalInformation._id} technicalInformation={technicalInformation} index={++index} onCompleteDeletion={completeDeletion} />
          ))}
        </TableLayout>
      ) : (
        <EmptyValuesLayout message="No technical data found!" />
      )}
    </div>
  );
};

export default TechnicalData;
