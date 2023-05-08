import style from "./FormLayout.module.css";

const FormLayout = (props) => {
  const title = props.title;
  const description = props.description;

  return (
    <div className={style.form}>
      <h1>{title}</h1>
      <p>{description}</p>
      <hr />
      <div className={style.content}>
        {props.children}
      </div>
    </div>
  );
};

export default FormLayout;
