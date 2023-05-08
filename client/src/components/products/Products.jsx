import { useState } from "react";
import useHttp from "../../hooks/use-http";
import constants from "../../utilities/constants";
import Query from "../query/Query";
import ProductRow from "./ProductRow";
import TableLayout from "../layouts/TableLayout";
import EmptyValuesLayout from "../layouts/EmptyValuesLayout";
import style from "./Products.module.css";

const Products = (props) => {
  const data = props.data;
  const categories = [constants.CATEGORY_DEFAULT_OPTION, ...data.categories];
  const [products, setProducts] = useState(data.data.products);
  const [total, setTotal] = useState(data.data.total);
  const [pagesNumber, setPagesNumber] = useState(data.data.pagesNumber);

  const { isLoading, sendRequest } = useHttp();

  const completeLoading = (data) => {
    const { products, total, pagesNumber } = data;
    setProducts(products);
    setTotal(total);
    setPagesNumber(pagesNumber);
    window.scroll(0, 0);
  };

  const loadProducts = (data) => {
    const { search, category, page, limit } = data;
    const categoryId = category._id;
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

  const completeDeletion = (productId) => {
    setProducts((previousProducts) => {
      const updatedProducts = previousProducts.filter((product) => product._id !== productId);
      return [...updatedProducts];
    });
    setTotal((previousTotal) => {
      return --previousTotal;
    });
  };

  return (
    <div className={`${style.settings} ${style.position}`}>
      <h1 className={style.center}>Products</h1>
      <Query type={constants.PRODUCTS_PAGE} categories={categories} total={total} pagesNumber={pagesNumber} isLoading={isLoading} onLoadValues={loadProducts}>
        {products.length ? (
          <TableLayout labels={constants.PRODUCTS_LABELS}>
            {products.map((product, index) => (
              <ProductRow key={product._id} product={product} index={++index} onCompleteDeletion={completeDeletion} />
            ))}
          </TableLayout>
        ) : (
          <EmptyValuesLayout message="No products found!" />
        )}
      </Query>
    </div>
  );
};

export default Products;
