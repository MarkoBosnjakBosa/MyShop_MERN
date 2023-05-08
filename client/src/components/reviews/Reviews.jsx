import { useState, useEffect, useCallback } from "react";
import { sendRequestData } from "../../api/api";
import NewReview from "./NewReview";
import ReviewRow from "./ReviewRow";
import LoaderLayout from "../layouts/LoaderLayout";
import Button from "@mui/material/Button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import style from "./Reviews.module.css";

const Reviews = (props) => {
  const productId = props.productId;
  const rating = props.rating;
  const isLoggedIn = props.isLoggedIn;
  const hasPermission = props.hasPermission;
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pagesNumber, setPagesNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = useCallback(async (page) => {
    const data = await loader(productId, page);
    const { reviews, total, pagesNumber } = data;
    setReviews(reviews);
    setTotal(total);
    setPagesNumber(pagesNumber);
    setIsLoading(false);
  }, [productId]);

  useEffect(() => {
    loadReviews(page);
  }, [loadReviews, page]);

  const rateProduct = (newRating) => {
    props.onRateProduct(newRating);
  };

  const changePage = (isNext) => {
    setPage((previousPage) => {
      if (isNext) {
        return ++previousPage;
      } else {
        return --previousPage;
      }
    });
  };

  return (
    <>
      {isLoading ? (
        <LoaderLayout isLoading={isLoading} />
      ) : (
        <>
          {(isLoggedIn && !hasPermission) && (
            <NewReview productId={productId} rating={rating} total={total} onLoadReviews={loadReviews} onRateProduct={rateProduct} />
          )}
          {reviews.map((review) =>
            <ReviewRow key={review._id} review={review} isLoggedIn={isLoggedIn} onLoadReviews={loadReviews} />
          )}
          <div className={style.center}>
            {(page - 1 > 0) && (
              <Button type="button" variant="contained" color="secondary" className={style.action} startIcon={<ArrowBackIosIcon />} onClick={() => changePage(false)}>{page - 1}</Button>
            )}
            <Button type="button" variant="contained" color="secondary" className={style.action}>{page}</Button>
            {(page < pagesNumber) && (
              <Button type="button" variant="contained" color="secondary" className={style.action} endIcon={<ArrowForwardIosIcon />} onClick={() => changePage(true)}>{page + 1}</Button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Reviews;

const loader = async (productId, page) => {
  const body = { productId, page };
  return await sendRequestData({ url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/getReviews`, method: "POST", headers: { "Content-Type": "application/json" }, body });
};
