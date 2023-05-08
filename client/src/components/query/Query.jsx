import { useState } from "react";
import { validObject } from "../../utilities/validations";
import constants from "../../utilities/constants";
import Download from "../actions/Download";
import TextLayout from "../layouts/TextLayout";
import SelectLayout from "../layouts/SelectLayout";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import NumbersIcon from "@mui/icons-material/Numbers";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import style from "./Query.module.css";

const Query = (props) => {
  const type = props.type;
  const categories = props.categories;
  const selectedCategory = props.selectedCategory;
  const total = props.total;
  const pagesNumber = props.pagesNumber;
  const isLoading = props.isLoading;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState("");
  const SHOP_PAGE = constants.SHOP_PAGE;
  const [limit, setLimit] = useState((type === SHOP_PAGE) ? 12 : 10);
  const PRODUCTS_PAGE = constants.PRODUCTS_PAGE;
  const ORDERS_PAGE = constants.ORDERS_PAGE;
  let options = [];
  switch (type) {
    case PRODUCTS_PAGE:
    case SHOP_PAGE:
      options = constants.ORDER_BY_PRODUCTS_OPTIONS;
      break;
    case constants.CONTACTS_PAGE:
      options = constants.ORDER_BY_CONTACTS_OPTIONS;
      break;
    case constants.USERS_PAGE:
      options = constants.ORDER_BY_USERS_OPTIONS;
      break;
    case ORDERS_PAGE:
      options = constants.ORDER_BY_ORDERS_OPTIONS;
      break;
    default:
      options = [];
  }

  const loadValues = (newPage, event) => {
    event.preventDefault();
    setPage(newPage);
    if (!limit) setLimit(1);
    props.onLoadValues({ search, category: selectedCategory ? selectedCategory : category, page: newPage, limit, orderBy });
  };

  return (
    <>
      <form onSubmit={(event) => loadValues(1, event)}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={((type === PRODUCTS_PAGE) || ((type === SHOP_PAGE) && !validObject(selectedCategory)) || (type === ORDERS_PAGE)) ? 6 : 12}>
              <TextLayout type="text" value={search} label="Search" onChange={(event) => setSearch(event.target.value)}>
                <SearchIcon />
              </TextLayout>
            </Grid>
            {((type === PRODUCTS_PAGE) || ((type === SHOP_PAGE) && !validObject(selectedCategory)) || (type === ORDERS_PAGE)) && (
              <Grid item xs={6}>
                <SelectLayout value={category} options={categories} label="Category" onChange={(value) => setCategory(value)} />
              </Grid>
            )}
            <Grid item xs={6}>
              <TextLayout type="number" value={limit} label="Limit" onChange={(event) => setLimit(event.target.value)}>
                <NumbersIcon />
              </TextLayout>
            </Grid>
            <Grid item xs={6}>
              <SelectLayout value={orderBy} options={options} label="Order by" onChange={(value) => setOrderBy(value)} />
            </Grid>
          </Grid>
          <div className={style.center}>
            <Button type="submit" variant="contained" endIcon={<CheckIcon />} disabled={isLoading}>{isLoading ? "Loading..." : "Search"}</Button>
            <Tooltip title={`Total: ${total}`}>
              <Button type="button" variant="contained" color="secondary" className={style.total}>Total: {total}</Button>
            </Tooltip>
            {((type === PRODUCTS_PAGE) || (type === ORDERS_PAGE)) && (
              <Download route={`/download/${type}`} type={constants.CSV} isButton search={search} categoryId={category._id} page={page} limit={limit} orderBy={orderBy} />
            )}
          </div>
        </Box>
      </form>
      <hr />
      {props.children}
      <div className={`${style.pages} ${style.center}`}>
        {(page - 1 > 0) && (
          <Button type="button" variant="contained" color="secondary" className={style.action} startIcon={<ArrowBackIosIcon />} onClick={(event) => loadValues(page - 1, event)}>{page - 1}</Button>
        )}
        <Button type="button" variant="contained" color="secondary" className={style.action}>{page}</Button>
        {(page < pagesNumber) && (
          <Button type="button" variant="contained" color="secondary" className={style.action} endIcon={<ArrowForwardIosIcon />} onClick={(event) => loadValues(page + 1, event)}>{page + 1}</Button>
        )}
      </div>
    </>
  );
};

export default Query;
