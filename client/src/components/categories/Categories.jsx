import { useState } from "react";
import constants from "../../utilities/constants";
import CategoriesForm from "./CategoriesForm";
import CategoryRow from "./CategoryRow";
import TableLayout from "../layouts/TableLayout";
import EmptyValuesLayout from "../layouts/EmptyValuesLayout";
import style from "./Categories.module.css";

const Categories = (props) => {
  const [categories, setCategories] = useState(props.categories);

  const completeCreation = (newCategory) => {
    setCategories((previousCategories) => {
      return [...previousCategories, newCategory];
    });
  };

  const completeEdit = (updatedCategory) => {
    setCategories((previousCategories) => {
      const updatedCategories = previousCategories.map((category) => category._id === updatedCategory._id ? updatedCategory : category);
      return [...updatedCategories];
    });
  };

  const completeDeletion = (categoryId) => {
    setCategories((previousCategories) => {
      const updatedCategories = previousCategories.filter((category) => category._id !== categoryId);
      return [...updatedCategories];
    });
  };

  return (
    <div className={style.settings}>
      <h1 className={style.center}>Categories</h1>
      <CategoriesForm onCompleteCreation={completeCreation} />
      <hr />
      {categories.length ? (
        <TableLayout labels={constants.CATEGORIES_LABELS}>
          {categories.map((category, index) => (
            <CategoryRow key={category._id} category={category} index={++index} onCompleteEdit={completeEdit} onCompleteDeletion={completeDeletion} />
          ))}
        </TableLayout>
      ) : (
        <EmptyValuesLayout message="No categories found!" />
      )}
    </div>
  );
};

export default Categories;
