import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRequestData } from "../../api/api";
import { validObject } from "../../utilities/validations";
import Reviews from "../reviews/Reviews";
import CarouselLayout from "../layouts/CarouselLayout";
import ProductInformation from "./ProductInformation";
import PageNotFound from "../pageNotFound/PageNotFound";
import LoaderLayout from "../layouts/LoaderLayout";
import Button from "@mui/material/Button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import style from "./Products.module.css";

const ViewProduct = (props) => {
  const productId = props.productId;
  const isLoggedIn = props.isLoggedIn;
  const hasPermission = props.hasPermission;
  const [product, setProduct] = useState({});
  const [tab, setTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const product = await loader(productId);
      if (validObject(product)) {
        setProduct(product);
        setIsLoading(false);
      } else {
        navigate("/shop");
      }
    }
    loadData();
  }, [productId, navigate]);

  const rateProduct = (newRating) => {
    setProduct((previousProduct) => {
      return { ...previousProduct, rating: newRating };
    });
  };

  return (
    <>
      {isLoading ? (
        <LoaderLayout isLoading={isLoading} />
      ) : (
        validObject(product) ? (
          <div className={`${style.settings} ${style.position}`}>
            <h1 className={`${style.title} ${style.center}`}>{product.title}</h1>
            <CarouselLayout images={[product.primaryImage, ...product.images]} />
            <hr />
            {(tab === 0) && (
              <>
                <ProductInformation product={product} isLoggedIn={isLoggedIn} hasPermission={hasPermission} />
                <Button type="button" variant="contained" color="secondary" className={`${style.rightButton} ${style.action} ${style.margin}`} endIcon={<ArrowForwardIosIcon />} onClick={() => setTab(1)}>Reviews</Button>
              </>
            )}
            {(tab === 1) && (
              <>
                <Reviews productId={productId} rating={product.rating} isLoggedIn={isLoggedIn} hasPermission={hasPermission} onRateProduct={rateProduct} />
                <Button type="button" variant="contained" color="secondary" className={`${style.leftButton} ${style.action} ${style.margin}`} startIcon={<ArrowBackIosIcon />} onClick={() => setTab(0)}>Information</Button>
              </>
            )}
          </div>
        ) : (
          <PageNotFound>Product not found!</PageNotFound>
        )
      )}
    </>
  );
};

export default ViewProduct;

const loader = async (productId) => {
  return await getRequestData({ url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/getProduct/${productId}` });
};
