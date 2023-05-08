import { useState } from "react";
import { getUserData } from "../../utilities/authentication";
import { getRequestData, sendRequestData } from "../../api/api";
import constants from "../../utilities/constants";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import CircularProgress from "@mui/material/CircularProgress";
import style from "./Actions.module.css";

const Download = (props) => {
  const route = props.route;
  const type = props.type;
  const isButton = props.isButton;
  const { token } = getUserData();
  const [isDownloading, setIsDownloading] = useState(false);

  const download= async () => {
    setIsDownloading(true);
    const url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}${route}`;
    let headers;
    let response;
    let data;
    if (type === constants.CSV) {
      const method = "POST";
      headers = { Authentication: `Bearer ${token}`, "Content-Type": "application/json" };
      const body = { search: props.search, categoryId: props.categoryId, page: props.page, limit: props.limit, orderBy: props.orderBy };
      data = { url, method, headers, body }; 
      response = await sendRequestData(data);
    } else {
      headers = { Authentication: `Bearer ${token}` };
      data = { url, headers }; 
      response = await getRequestData(data);
    }
    window.open(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/temporary/${response.fileName}`, "_blank");
    setIsDownloading(false);
  };

  return (
    <>
      {isButton ? (
        <Button type="button" variant="contained" className={style.action} endIcon={<DownloadIcon />} onClick={download} disabled={isDownloading}>Download</Button>
      ) : (
        isDownloading ? (
          <CircularProgress className={`${style.action} ${style.loader}`} />
        ) : (
          <DownloadIcon className={style.action} onClick={download} />
        )
      )}
    </>
  );
};

export default Download;
