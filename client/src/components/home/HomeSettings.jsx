import { useState, useRef, useEffect } from "react";
import useHttp from "../../hooks/use-http";
import { getUserData } from "../../utilities/authentication";
import { getFile } from "../../utilities/scripts";
import Images from "../images/Images";
import MessageLayout from "../layouts/MessageLayout";
import { Editor } from "@tinymce/tinymce-react";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import style from "./Home.module.css";

const HomeSettings = (props) => {
  const homeSettings = props.homeSettings;
  const { token } = getUserData();
  const [homeSettingsId, setHomeSettingsId] = useState(homeSettings._id);
  const [images, setImages] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const messageRef = useRef(null);

  const { isLoading, error, sendRequest } = useHttp();

  useEffect(() => {
    homeSettings.images.forEach((image) => {
      setImages((previousImages) => {
        return [...previousImages, getFile(image)];
      });
    });
  }, [homeSettings.images]);

  const completeSaving = (data) => {
    setHomeSettingsId(data._id);
    setIsSaved(true);
  };

  const saveHomeSettings = () => {
    let formData = new FormData();
    formData.append("homeSettingsId", homeSettingsId);
    formData.append("message", messageRef.current.getContent());
    images.forEach((image) => formData.append("images", image.file));

    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/saveHomeSettings`,
        method: "POST",
        headers: { Authentication: `Bearer ${token}` },
        body: formData
      },
      completeSaving
    );
  };

  const addImages = (newImage) => {
    setImages((previousImages) => {
      return [...previousImages, newImage];
    });
  };

  const removeImage = (currentIndex) => {
    setImages((previousImages) => {
      const updatedImages = previousImages.filter((_previousImage, index) => index !== currentIndex);
      return [...updatedImages];
    });
  };

  return (
    <div className={style.home}>
      <h1>Home settings</h1>
      {isSaved && (
        <MessageLayout type="success" closeable onClose={() => setIsSaved(false)}>
          Home settings have been successfully saved!
        </MessageLayout>
      )}
      {error && (
        <MessageLayout type="error">
          <div>Request failed!</div>
          <strong>{error}</strong>
        </MessageLayout>
      )}
      <Images images={images} onAdd={addImages} onRemove={removeImage} />
      <Editor
        apiKey={process.env.REACT_APP_TINY_MCE_EDITOR_API_KEY}
        onInit={(event, editor) => messageRef.current = editor}
        initialValue={homeSettings.message}
        init={{
          height: "500px",
          menubar: "file edit view insert format tools table help",
          plugins: ["advlist", "autolink", "lists", "link", "image", "charmap", "preview", "anchor", "searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media", "table", "code", "help", "wordcount"],
          toolbar: "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
          content_style: "body { font-family: Helvetica, Arial, sans-serif; font-size: 14px }"
        }}
      />
      <Button type="button" variant="contained" className={style.action} endIcon={<CheckIcon />} onClick={saveHomeSettings}>{isLoading ? "Sending..." : "Save"}</Button>
    </div>
  );
};

export default HomeSettings;
