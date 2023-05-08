import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { cartActions } from "../../store/cart-slice";
import constants from "../../utilities/constants";
import Tooltip from "@mui/material/Tooltip";
import style from "./SelectedQuantityLayout.module.css";

const SelectedQuantityLayout = (props) => {
  const quantity = props.quantity;
  const productId = props.productId;
  const [selectedQuantity, setSelectedQuantity] = useState(props.selectedQuantity);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedQuantity > quantity) {
      dispatch(cartActions.updateSelectedQuantity({ productId, selectedQuantity: quantity }));
      setSelectedQuantity(quantity);
    }
  }, [quantity, selectedQuantity, productId, dispatch]);

  const updateSelectedQuantity = (event) => {
    const newSelectedQuantity = Number(event.target.value);
    if ((newSelectedQuantity > 0) && (newSelectedQuantity <= quantity)) {
      setSelectedQuantity(newSelectedQuantity);
      props.onUpdate(newSelectedQuantity);
    }
  };

  const checkForbiddenNumberSymbols = (event) => {
    if (constants.FORBIDDEN_NUMBER_SYMBOLS.includes(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <Tooltip title={`Remaining quantity is: ${quantity}.`}>
      <input type="number" value={selectedQuantity} min="1" max={quantity} className={style.field} onKeyDown={checkForbiddenNumberSymbols} onChange={(event) => updateSelectedQuantity(event)} />
    </Tooltip>
  );
};

export default SelectedQuantityLayout;
