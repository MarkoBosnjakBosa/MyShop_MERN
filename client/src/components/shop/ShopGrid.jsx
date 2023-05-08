import ShopCard from "./ShopCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import EmptyValuesLayout from "../layouts/EmptyValuesLayout";

const ShopGrid = (props) => {
  const products = props.products;

  return (
    (products.length) ? (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid key={product._id} item xs={3}>
              <ShopCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Box>
    ) : (
      <EmptyValuesLayout message="No products found!" />
    )
  );
};

export default ShopGrid;
