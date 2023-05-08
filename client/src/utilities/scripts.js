import { Buffer } from "buffer";

export const loadScript = (url) => {
  const scripts = document.getElementsByTagName("script");
  let scriptFound = false;
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src === url) scriptFound = true;
  }
  if (!scriptFound) {
    const script = document.createElement("script");
    script.setAttribute("src", url);
    document.head.appendChild(script);
  }
};

export const displayReCaptcha = (type) => {
  const reCaptchas = document.getElementsByClassName("grecaptcha-badge");
  if (reCaptchas && reCaptchas.length) {
    if (type) {
      reCaptchas[0].style.visibility = "visible";
    } else {
      reCaptchas[0].style.visibility = "hidden";
    }
  }
};

export const getImage = (image) => {
  if (image && !(image instanceof File)) return `data:${image.mimeType};base64,${(new Buffer.from(image.buffer)).toString("base64")}`;
  else return "";
};

export const getImageName = (imageName) => {
  const date = imageName.substring(imageName.indexOf("_") + 1, imageName.indexOf("."));
  return imageName.replace(`_${date}`, "");
};

export const getFile = (image) => {
  const file = new File([Buffer.from(image.buffer)], image.name, { type: image.mimeType });
  const src = getImage(image);
  return { file, src };
};

export const getRating = (rating, averageRating) => {
  if (rating <= averageRating) return true;
  return false;
};

export const formatPrice = (number) => {
  return `${Number(number).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } €`;
};

export const formatStripePrice = (number) => {
  return Number(number).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(",", "").replace(".", "");
};
