import React, { useEffect } from 'react'; // import React and useEffect hook
import ProductItem from '../ProductItem'; // import ProductItem component
import { useDispatch, useSelector } from 'react-redux'; // import useDispatch and useSelector from react-redux
import { UPDATE_PRODUCTS } from '../../utils/actions'; // import UPDATE_PRODUCTS from utils/actions
import { useQuery } from '@apollo/client'; // import useQuery from @apollo/client
import { QUERY_PRODUCTS } from '../../utils/queries'; // import QUERY_PRODUCTS from utils/queries
import { idbPromise } from '../../utils/helpers'; // import idbPromise from utils/helpers
import spinner from '../../assets/spinner.gif'; // import spinner.gif

function ProductList() { // define ProductList component
  const dispatch = useDispatch(); // set dispatch to useDispatch
  const state = useSelector((state) => state); // set state to useSelector with state as argument

  const { currentCategory } = state; // destructure currentCategory from state

  const { loading, data } = useQuery(QUERY_PRODUCTS); // set loading and data to useQuery with QUERY_PRODUCTS as argument

  useEffect(() => { // define useEffect hook
    if (data) { // if data exists
      dispatch({ // dispatch UPDATE_PRODUCTS
        type: UPDATE_PRODUCTS, // set type to UPDATE_PRODUCTS
        products: data.products, // set products to data.products
      });
      data.products.forEach((product) => { // for each product in data.products
        idbPromise('products', 'put', product); // call idbPromise with 'products', 'put', and product as arguments
      });
    } else if (!loading) { // else if loading is false
      idbPromise('products', 'get').then((products) => { // call idbPromise with 'products' and 'get' as arguments
        dispatch({ // dispatch UPDATE_PRODUCTS
          type: UPDATE_PRODUCTS, // set type to UPDATE_PRODUCTS
          products: products, // set products to products
        });
      });
    }
  }, [data, loading, dispatch]); // pass data, loading, and dispatch as dependencies

  function filterProducts() { // define filterProducts function
    if (!currentCategory) { // if currentCategory is false
      return state.products; // return state.products
    }

    return state.products.filter( // return state.products.filter
      (product) => product.category._id === currentCategory // where product.category._id === currentCategory
    );
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList; // export ProductList
