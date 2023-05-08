import { useState } from "react";
import { getImage } from "../../utilities/scripts";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const CarouselLayout = (props) => {
  const images = props.images;
  const steps = images.length;
  const theme = useTheme();
  const [step, setStep] = useState(0);

  const changeNext = () => {
    setStep((previousStep) => ++previousStep);
  };

  const changeBack = () => {
    setStep((previousStep) => --previousStep);
  };

  return (
    <Box sx={{ maxWidth: "900px", flexGrow: 1 }}>
      <AutoPlaySwipeableViews axis={theme.direction === "rtl" ? "x-reverse" : "x"} index={step} enableMouseEvents onChangeIndex={(value) => setStep(value)}>
        {images.map((image, index) => (
          <div key={index}>
            {Math.abs(step - index) <= 2 ? (
              <Box src={getImage(image)} alt={image.name} component="img" sx={{ height: "450px", width: "900px", maxWidth: "100%", display: "block", overflow: "hidden" }} />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper steps={steps} position="static" activeStep={step}
        nextButton={
          <Button size="small" onClick={changeNext} disabled={step === steps - 1}>
            Next
            {theme.direction === "rtl" ? (<KeyboardArrowLeft />) : (<KeyboardArrowRight />)}
          </Button>
        }
        backButton={
          <Button size="small" onClick={changeBack} disabled={step === 0}>
            {theme.direction === "rtl" ? (<KeyboardArrowRight />) : (<KeyboardArrowLeft />)}
            Back
          </Button>
        }
      />
    </Box>
  );
};

export default CarouselLayout;
