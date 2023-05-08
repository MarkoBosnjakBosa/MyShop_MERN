import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import useInput from "../../hooks/use-input";
import { getUserData } from "../../utilities/authentication";
import { getRequestData, getCategories } from "../../api/api";
import { validTitle, validDescription, validPrice, validQuantity, validObject, validPrimaryImage } from "../../utilities/validations";
import { loadScript, displayReCaptcha, getFile } from "../../utilities/scripts";
import constants from "../../utilities/constants";
import Delete from "../actions/Delete";
import TechnicalDataTable from "./TechnicalDataTable";
import PrimaryImage from "../images/PrimaryImage";
import Images from "../images/Images";
import TextLayout from "../layouts/TextLayout";
import SelectLayout from "../layouts/SelectLayout";
import MessageLayout from "../layouts/MessageLayout";
import LoaderLayout from "../layouts/LoaderLayout";
import Button from "@mui/material/Button";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import DescriptionIcon from "@mui/icons-material/Description";
import EuroIcon from "@mui/icons-material/Euro";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import style from "./Products.module.css";

const Product = (props) => {
  const type = props.type;
  const productId = props.productId;
  const { token } = getUserData();
  const [product, setProduct] = useState({});
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableTechnicalData, setAvailableTechnicalData] = useState([]);
  const [category, setCategory] = useState("");
  const [technicalInformation, setTechnicalInformation] = useState("");
  const [technicalData, setTechnicalData] = useState([]);
  const [primaryImage, setPrimaryImage] = useState({});
  const [images, setImages] = useState([]);
  const [tab, setTab] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const EDIT_PRODUCT = constants.EDIT_PRODUCT;

  const { isLoading, error, sendRequest } = useHttp();
  const {
    value: title,
    isValid: titleIsValid,
    error: titleError,
    changeValue: changeTitle,
    initializeValue: initializeTitle,
    blur: blurTitle
  } = useInput(validTitle);
  const {
    value: description,
    isValid: descriptionIsValid,
    error: descriptionError,
    changeValue: changeDescription,
    initializeValue: initializeDescription,
    blur: blurDescription
  } = useInput(validDescription);
  const {
    value: price,
    isValid: priceIsValid,
    error: priceError,
    changeValue: changePrice,
    initializeValue: initializePrice,
    blur: blurPrice
  } = useInput(validPrice);
  const {
    value: quantity,
    isValid: quantityIsValid,
    error: quantityError,
    changeValue: changeQuantity,
    initializeValue: initializeQuantity,
    blur: blurQuantity
  } = useInput(validQuantity);

  useEffect(() => {
    loadScript(`https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_RECAPTCHA_v3_SITE_KEY}`);
    displayReCaptcha(true);
    const loadData = async () => {
      const { product, categories, technicalData, saved } = await loader(type, productId);
      setAvailableCategories(categories);
      setAvailableTechnicalData(technicalData);
      if (type === EDIT_PRODUCT) {
        if (validObject(product)) {
          setProduct(product);
          initializeTitle(product.title);
          initializeDescription(product.description);
          initializePrice(product.price.toFixed(2));
          initializeQuantity(product.quantity);
          setCategory(categories.filter((category) => category._id === product.categoryId)[0]);
          setTechnicalData(product.technicalData);
          setPrimaryImage(getFile(product.primaryImage));
          if (product.images && product.images.length) {
            product.images.forEach((image) => {
              setImages((previousImages) => {
                return [...previousImages, getFile(image)];
              });
            });
          }
          setIsSaved(saved);
        } else {
          navigate("/products");
        }
      }
      setLoading(false);
    };
    loadData();
    return () => {
      displayReCaptcha(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, productId]);

  const formIsValid = titleIsValid && descriptionIsValid && priceIsValid && quantityIsValid && validObject(category) && validPrimaryImage(primaryImage);

  const completeSaving = (data) => {
    if (type === constants.CREATE_PRODUCT) {
      navigate(`/product/edit/${data._id}?saved=true`);
    } else {
      setTab(0);
      setIsSaved(true);
    }
  };

  const saveProduct = (event) => {
    event.preventDefault();
    if (!formIsValid) {
      return;
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(process.env.REACT_APP_RECAPTCHA_v3_SITE_KEY, { action: "submit" }).then((reCaptchaToken) => {
        let formData = new FormData();
        if (type === EDIT_PRODUCT) {
          formData.append("_id", product._id);
        }
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("quantity", quantity);
        formData.append("categoryId", category._id);
        formData.append("technicalData", JSON.stringify(technicalData));
        formData.append("primaryImage", primaryImage.file);
        images.forEach((image) => formData.append("images", image.file));
        formData.append("reCaptchaToken", reCaptchaToken);

        sendRequest(
          {
            url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/${type}Product`,
            method: type === EDIT_PRODUCT ? "PUT" : "POST",
            headers: { Authentication: `Bearer ${token}` },
            body: formData
          },
          completeSaving
        );
      });
    });
  };

  const addTechnicalInformation = () => {
    setTechnicalData((previousTechnicalData) => {
      const technicalInformationId = technicalInformation._id;
      const foundIndex = previousTechnicalData.findIndex((technicalInformation) => technicalInformation._id === technicalInformationId);
      if (foundIndex < 0) {
        const newTechnicalInformation = { _id: technicalInformationId, title: technicalInformation.title, value: "" };
        return [...previousTechnicalData, newTechnicalInformation];
      } else {
        return [...previousTechnicalData];
      }
    });
    setTechnicalInformation("");
  };

  const updateTechnicalInformation = (technicalInformationId, value) => {
    setTechnicalData((previousTechnicalData) => {
      const updatedTechnicalData = previousTechnicalData.map((technicalInformation) => {
        if (technicalInformation._id === technicalInformationId) {
          technicalInformation = { ...technicalInformation, value };
        }
        return technicalInformation;
      });
      return [...updatedTechnicalData];
    });
  };

  const removeTechnicalInformation = (technicalInformationId) => {
    setTechnicalData((previousTechnicalData) => {
      const updatedTechnicalData = previousTechnicalData.filter((technicalInformation) => technicalInformation._id !== technicalInformationId);
      return [...updatedTechnicalData];
    });
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

  const completeDeletion = () => {
    navigate("/products");
  };

  return (
    <>
      {loading ? (
        <LoaderLayout isLoading={loading} />
      ) : (
        <div className={`${style.form} ${style.position} ${style.center}`}>
          <h1>Product</h1>
          <p className={style.title}>{(type === EDIT_PRODUCT) ? <strong>{title}</strong> : "Create a new product"}</p>
          <hr />
          {isSaved && (
            <MessageLayout type="success" closeable onClose={() => setIsSaved(false)}>
              The product has been successfully saved!
            </MessageLayout>
          )}
          {error && (
            <MessageLayout type="error">
              <div>Request failed!</div>
              <strong>{error}</strong>
            </MessageLayout>
          )}
          <form onSubmit={saveProduct} noValidate>
            {(tab === 0) && (
              <div className={`${style.content} ${style.position}`}>
                <TextLayout type="text" value={title} label="Title" error={titleError} onChange={changeTitle} onBlur={blurTitle} required>
                  <SubtitlesIcon />
                </TextLayout>
                <TextLayout type="text" value={description} label="Description" error={descriptionError} multiline onChange={changeDescription} onBlur={blurDescription} required>
                  <DescriptionIcon />
                </TextLayout>
                <TextLayout type="text" value={price} label="Price" error={priceError} onChange={changePrice} onBlur={blurPrice} required>
                  <EuroIcon />
                </TextLayout>
                <TextLayout type="text" value={quantity} label="Quantity" error={quantityError} onChange={changeQuantity} onBlur={blurQuantity} required>
                  <InventoryIcon />
                </TextLayout>
                <SelectLayout value={category} options={availableCategories} label="Category" onChange={(value) => setCategory(value)} />
                <Button type="button" variant="contained" color="secondary" className={`${style.rightButton} ${style.action}`} endIcon={<ArrowForwardIosIcon />} onClick={() => setTab(1)}>Next</Button>
              </div>
            )}
            {(tab === 1) && (
              <>
                <TechnicalDataTable 
                  technicalInformation={technicalInformation} 
                  availableTechnicalData={availableTechnicalData} 
                  technicalData={technicalData} 
                  onChange={(value) => setTechnicalInformation(value)} 
                  onAdd={addTechnicalInformation} 
                  onUpdate={updateTechnicalInformation}
                  onRemove={removeTechnicalInformation}
                />
                <Button type="button" variant="contained" color="secondary" className={`${style.leftButton} ${style.action} ${style.margin}`} startIcon={<ArrowBackIosIcon />} onClick={() => setTab(0)}>Back</Button>
                <Button type="button" variant="contained" color="secondary" className={`${style.rightButton} ${style.action} ${style.margin}`} endIcon={<ArrowForwardIosIcon />} onClick={() => setTab(2)}>Next</Button>
              </>
            )}
            {(tab === 2) && (
              <>
                <PrimaryImage primaryImage={primaryImage} onChange={(value) => setPrimaryImage(value)} />
                <Images images={images} onAdd={addImages} onRemove={removeImage} />
                <Button type="button" variant="contained" color="secondary" className={`${style.leftButton} ${style.action}`} startIcon={<ArrowBackIosIcon />} onClick={() => setTab(1)}>Back</Button>
                <div className={`${style.rightButton} ${style.action}`}>
                  {(type === EDIT_PRODUCT) && (
                    <Delete route={`/deleteProduct/${product._id}`} message={`Delete product ${product.title}?`} isButton onCompleteDeletion={completeDeletion} />
                  )}
                  <Button type="submit" variant="contained" className={style.space} endIcon={<CheckIcon />} disabled={!formIsValid || isLoading}>{isLoading ? "Sending..." : type === EDIT_PRODUCT ? "Edit" : "Create"}</Button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default Product;

const loader = async (type, productId) => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const categories = await getCategories(`${baseUrl}/getCategories`);
  const { token } = getUserData();
  const technicalData = await getRequestData({ url: `${baseUrl}/getTechnicalData`, headers: { Authentication: `Bearer ${token}` } });
  if (type === constants.EDIT_PRODUCT) {
    const product = await getRequestData({ url: `${baseUrl}/getProduct/${productId}` });
    const searchParams = new URL(window.location.href).searchParams;
    const saved = searchParams.get("saved");
    return { product, categories, technicalData, saved };
  } else {
    return { categories, technicalData };
  }
};
