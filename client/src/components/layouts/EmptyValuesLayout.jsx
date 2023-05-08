import style from "./EmptyValuesLayout.module.css";

const EmptyValuesLayout = (props) => {
  const message = props.message;

  return (
    <div className={style.noValues}>{message}</div>
  );
};

export default EmptyValuesLayout;
