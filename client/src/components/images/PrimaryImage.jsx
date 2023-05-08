import { getImageName } from "../../utilities/scripts";
import { validObject } from "../../utilities/validations";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import style from "./Images.module.css";

const PrimaryImage = (props) => {
  const primaryImage = props.primaryImage;

  const changePrimaryImage = (event) => {
    const files = event.target.files;
    if (files && files.length) {
      const file = files[0];
      if (file.type.match("image.*")) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const newPrimaryImage = { file, src: e.target.result };
          props.onChange(newPrimaryImage);
        }
        fileReader.readAsDataURL(file);
      } else {
        props.onChange({});
      }
    } else {
      props.onChange({});
    }
  };

  return (
    <>
      <input type="file" accept="image/*" id="primaryImage" className={style.primaryImage} onChange={changePrimaryImage} />
      <label htmlFor="primaryImage">
        Primary image
        <Button type="button" variant="contained" component="span" endIcon={<PhotoCameraIcon />} className={style.upload}>Upload</Button>
      </label>
      <div>
        {(validObject(primaryImage) > 0) && (
          <>
            <Box src={primaryImage.src} alt={primaryImage.file.name} component="img" className={`${style.preview} ${style.height} ${style.width}`} />
            <div className={style.text}>{getImageName(primaryImage.file.name)}</div>
          </>
        )}
      </div>
    </>
  );
};

export default PrimaryImage;
