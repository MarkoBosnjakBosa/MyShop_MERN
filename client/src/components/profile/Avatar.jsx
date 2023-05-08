import { useState, useRef } from "react";
import useHttp from "../../hooks/use-http";
import { getUserData } from "../../utilities/authentication";
import { getImage } from "../../utilities/scripts";
import { validObject } from "../../utilities/validations";
import constants from "../../utilities/constants";
import MessageLayout from "../layouts/MessageLayout";
import avatarImage from "../../assets/images/AvatarImage.jpg";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CameraRollIcon from "@mui/icons-material/CameraRoll";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import style from "./Profile.module.css";

const Avatar = (props) => {
  const { token, userId } = getUserData();
  const [avatar, setAvatar] = useState(props.avatar);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isPhotographTaken, setIsPhotographTaken] = useState(false);
  const [isPhotographShot, setIsPhotographShot] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const { isLoading, error, sendRequest } = useHttp();

  const toggleCamera = () => {
    if (isCameraOpen) {
      setIsCameraOpen(false);
      stopCameraStream();
    } else {
      setIsCameraOpen(true);
      startCameraStream();
    }
  };

  const startCameraStream = () => {
    setLoading(true);
    navigator.mediaDevices.getUserMedia(constants.VIDEO_OPTIONS).then((stream) => {
      setLoading(false);
      const video = videoRef.current;
      video.srcObject = stream;
      video.play();
    }).catch(() => {
      setLoading(false);
    });
  };

  const stopCameraStream = () => {
    setIsCameraOpen(false);
    setIsPhotographTaken(false);
    const video = videoRef.current;
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    video.srcObject = null;
  };

  const takePhotograph = () => {
    if (!isPhotographTaken) {
      setIsPhotographShot(true);
      setTimeout(() => { setIsPhotographShot(false); }, process.env.REACT_APP_PHOTOGRAPH_OPACITY_EXPIRATION_TIME);
    }
    setIsPhotographTaken((previousIsPhotoTaken) => {
      return !previousIsPhotoTaken;
    });
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 300, 300);
  };

  const completeSaving = (newAvatar) => {
    setAvatar(newAvatar);
    props.onChange(newAvatar);
  };

  const saveAvatar = async (event, type) => {
    const formData = new FormData();
    formData.append("userId", userId);
    if (type === "default") {
      const files = event.target.files;
      if (files && files.length) {
        const file = files[0];
        if (file.type.match("image.*")) {
          formData.append("avatar", file);
        }
      }
    } else if (type === "custom") {
      const canvas = canvasRef.current;
      const photograph = await new Promise((resolve, reject) => canvas.toBlob(resolve));
      const file = new File([photograph], "Photograph.png", { type: "image/png" });
      formData.append("avatar", file);
    } else {
      const confirmed = window.confirm("Do you want to delete your avatar?");
      if (confirmed) {
        formData.append("avatar", {});
      } else {
        return;
      }
    }

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/saveAvatar`,
        method: "POST",
        headers: { Authentication: `Bearer ${token}` },
        body: formData
      },
      completeSaving
    );
  };

  const downloadPhotograph = () => {
    const download = document.getElementById("download");
    const canvas = document.getElementById("canvas");
    const photograph = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    download.setAttribute("href", photograph);
  };

  return (
    <div className={style.avatar}>
      <h1>Avatar</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            {validObject(avatar) ? (
              <>
                <Box src={getImage(avatar)} alt={avatar.name} component="img" className={`${style.image} ${style.width}`} />
                <Button type="button" variant="contained" color="error" className={style.margin} endIcon={<DeleteIcon />} onClick={(event) => saveAvatar(event, "delete")} disabled={isLoading}>Delete</Button>
              </>
            ) : (
              <img src={avatarImage} alt="Avatar" className={`${style.image} ${style.width}`} />
            )}
          </Grid>
          <Grid item xs={6}>
            <h3>Upload</h3>
            {error && (
              <MessageLayout type="error">
                <div>Request failed!</div>
                <strong>{error}</strong>
              </MessageLayout>
            )}
            <div>
              <input type="file" accept="image/*" id="avatar" className={style.invisible} onChange={(event) => saveAvatar(event, "default")} />
              <label htmlFor="avatar">
                <Button type="button" variant="contained" component="span" endIcon={<PhotoCameraIcon />} disabled={isLoading}>Upload from computer</Button>
              </label>
            </div>
            <div className={style.margin}>
              <Button type="button" variant="contained" color={isCameraOpen ? "secondary" : "primary"} endIcon={<CameraRollIcon />} onClick={toggleCamera} disabled={loading}>{isCameraOpen ? "Close camera" : "Open camera"}</Button>
            </div>
            {isCameraOpen && (
              <>
                <div className={isPhotographShot ? `${style.margin} ${style.flash}` : style.margin}>
                  <video ref={videoRef} className={isPhotographTaken ? style.invisible: ""} />
                  <canvas ref={canvasRef} id="canvas" className={!isPhotographTaken ? style.invisible: ""} width="300px" height="300px" />
                  {!loading && (
                    <Button type="button" variant="contained" className={style.margin} endIcon={<PhotoCameraIcon />} onClick={takePhotograph}>{isPhotographTaken ? "New" : "Take"}</Button>
                  )}
                </div>
                {isPhotographTaken && (
                  <div className={style.margin}>
                    <Button type="button" variant="contained" endIcon={<CloudUploadIcon />} onClick={(event) => saveAvatar(event, "custom")} disabled={isLoading}>Upload</Button>
                    <a id="download" href="/#" download="Photograph.png" className={`${style.download} ${style.space}`} onClick={downloadPhotograph}>
                      <Button type="button" variant="contained" endIcon={<DownloadIcon />}>Download</Button>
                    </a>
                  </div>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Avatar;
