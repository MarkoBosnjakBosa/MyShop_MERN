import CircularProgress from "@mui/material/CircularProgress";
import style from "./LoaderLayout.module.css";

const LoaderLayout = (props) => {
  const isLoading = props.isLoading;

  return (
    <>
      {isLoading && (
        <CircularProgress className={style.loader} />
      )}
    </>
  );
};

export default LoaderLayout;
