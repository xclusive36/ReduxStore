import React from "react"; // import React
import ProductList from "../components/ProductList"; // import ProductList component
import CategoryMenu from "../components/CategoryMenu"; // import CategoryMenu component
import Cart from "../components/Cart"; // import Cart component

const Home = () => {
  return (
    <div className="container">
      <CategoryMenu />
      <ProductList />
      <Cart />
    </div>
  );
};

export default Home; // export Home
