import CarouselLayout from "../layouts/CarouselLayout";
import onlineShopImage from "../../assets/images/OnlineShopImage.jpg";
import style from "./Home.module.css";

const Home = (props) => {
  const homeSettings = props.homeSettings;
  const { images, message } = homeSettings;

  return (
    <div className={style.home}>
      <h1>MyShop</h1>
      {images.length ? (
        <CarouselLayout images={images} />
      ) : (
        <img src={onlineShopImage} alt="Online shop" className={style.default} />
      )}
      {message ? (
        <div className={style.message} dangerouslySetInnerHTML={{ __html: message }} />
      ) : (
        <h3>Welcome to the best online shop in the world!</h3>
      )}
    </div>
  );
};

export default Home;
