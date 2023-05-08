import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import style from "./Images.module.css";

const Images = (props) => {
  const images = props.images;
  const [isFocused, setIsFocused] = useState(false);

  const addImages = (event) => {
    const files = event.target.files;
    if (files && files.length) {
      if ((files.length + images.length) < 5) {
        for (let i = 0, file; !!(file = files[i]); i++) {
          if (!file.type.match("image.*")) {
            continue;
          }
          const fileReader = new FileReader();
          fileReader.onload = (e) => {
            const newImage = { file, src: e.target.result };
            props.onAdd(newImage);
          }
          fileReader.readAsDataURL(file);
        }
      }
    }
  };

  const removeImage = (index) => {
    props.onRemove(index);
  };

  return (
    <>
      <h3>Images</h3>
      <div className={`${style.dropzone} ${style.height} ${style.relative} ${isFocused ? style.focused : ""}`} onDragOver={() => setIsFocused(true)} onDragLeave={() => setIsFocused(false)} onDrop={() => setIsFocused(false)}>
        <div className={`${style.description} ${style.absolute}`}>
          <CloudUploadIcon />
          <p>
            Select images or drag them here.<br />
            Maximum of 4 images allowed.
          </p>
        </div>
        <input type="file" accept="image/*" className={`${style.images} ${style.height} ${style.fullWidth} ${style.pointer}`} multiple onChange={addImages} />
      </div>
      <div className={`${style.previewImages} ${style.preview}`}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            {images.map((image, index) => (
              <Grid key={index} item xs={3} className={`${style.grid} ${style.relative}`}>
                <Box src={image.src} alt={image.file.name} component="img" className={`${style.image} ${style.height} ${style.fullWidth}`} />
                <HighlightOffIcon className={`${style.removeImage} ${style.absolute} ${style.pointer}`} onClick={() => removeImage(index)} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default Images;
