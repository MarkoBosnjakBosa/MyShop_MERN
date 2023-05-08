import { useState, useEffect } from "react";
import useHttp from "../../hooks/use-http";
import { sendRequestData, getCategories } from "../../api/api";
import { validObject } from "../../utilities/validations";
import constants from "../../utilities/constants";
import Query from "../query/Query";
import ShopGrid from "./ShopGrid";
import LoaderLayout from "../layouts/LoaderLayout";
import style from "./Shop.module.css";

const Shop = (props) => {
  const categoryId = props.categoryId;
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagesNumber, setPagesNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const SHOP_PAGE = constants.SHOP_PAGE;

  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    const loadData = async () => {
      const loadedData = await loader(categoryId);
      const { data, selectedCategory } = loadedData;
      let { categories } = loadedData;
      categories = [constants.CATEGORY_DEFAULT_OPTION, ...categories];
      setCategories(categories);
      setSelectedCategory(selectedCategory);
      const { products, total, pagesNumber } = data;
      setProducts(products);
      setTotal(total);
      setPagesNumber(pagesNumber);
      setLoading(false);
    };
    loadData();
  }, [categoryId]);

  const completeLoading = (data) => {
    const { products, total, pagesNumber } = data;
    setProducts(products);
    setTotal(total);
    setPagesNumber(pagesNumber);
    window.scroll(0, 0);
  };

  const loadProducts = (data) => {
    const { search, page, limit } = data;
    const categoryId = data.category._id;
    const orderBy = data.orderBy.value;
    
    sendRequest(
      {
        url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/getProducts`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search, categoryId, page, limit, orderBy })
      },
      completeLoading
    );
  };

  return (
    <>
      {loading ? (
        <LoaderLayout isLoading={loading} />
      ) : (
        <div className={style.settings}>
          <h1 className={style.center}>
            Shop
            {validObject(selectedCategory) && (
              <>
                : {selectedCategory.title}
              </>
            )}
          </h1>
          <Query type={SHOP_PAGE} categories={categories} selectedCategory={selectedCategory} total={total} pagesNumber={pagesNumber} isLoading={isLoading} onLoadValues={loadProducts}>
            <ShopGrid products={products} />
          </Query>
        </div>
      )}
    </>
  );
};

export default Shop;

const loader = async (categoryId) => {
  const baseUrl = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}`;
  const categories = await getCategories(`${baseUrl}/getCategories`);
  const body = { search: "", categoryId: categoryId || "", page: 1, limit: 12, orderBy: "" };
  const productsData = await sendRequestData({ url: `${baseUrl}/getProducts`, method: "POST", body });
  const selectedCategory = categoryId ? categories.filter((category) => category._id === categoryId)[0] : "";
  return { data: productsData, categories, selectedCategory };
};
