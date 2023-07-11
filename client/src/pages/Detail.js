import React, { useEffect, useState } from 'react'; // import React, useEffect hook, and useState hook
import { Link, useParams } from 'react-router-dom'; // import Link and useParams from react-router-dom
import { useQuery } from '@apollo/client'; // import useQuery from @apollo/client

import Cart from '../components/Cart'; // import Cart component
import { useDispatch, useSelector } from 'react-redux'; // import useDispatch and useSelector from react-redux
import {
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
  UPDATE_PRODUCTS,
} from '../utils/actions'; // import REMOVE_FROM_CART, UPDATE_CART_QUANTITY, ADD_TO_CART, and UPDATE_PRODUCTS from utils/actions
import { QUERY_PRODUCTS } from '../utils/queries'; // import QUERY_PRODUCTS from utils/queries
import { idbPromise } from '../utils/helpers'; // import idbPromise from utils/helpers
import spinner from '../assets/spinner.gif'; // import spinner.gif

function Detail() { // define Detail component
  const dispatch = useDispatch(); // set dispatch to useDispatch
  const state = useSelector((state) => state); // set state to useSelector with state as argument
  const { id } = useParams(); // set id to useParams

  const [currentProduct, setCurrentProduct] = useState({}); // set currentProduct and setCurrentProduct to useState with {} as argument

  const { loading, data } = useQuery(QUERY_PRODUCTS); // set loading and data to useQuery with QUERY_PRODUCTS as argument

  const { products, cart } = state; // destructure products and cart from state

  useEffect(() => { // define useEffect hook
    // already in global store
    if (products.length) { // if products.length is truthy
      setCurrentProduct(products.find((product) => product._id === id)); // set currentProduct to products.find with product as argument
    }
    // retrieved from server
    else if (data) { // else if data exists
      dispatch({ // dispatch UPDATE_PRODUCTS
        type: UPDATE_PRODUCTS, // set type to UPDATE_PRODUCTS
        products: data.products, // set products to data.products
      });

      data.products.forEach((product) => { // for each product in data.products
        idbPromise('products', 'put', product); // call idbPromise with 'products', 'put', and product as arguments
      });
    }
    // get cache from idb
    else if (!loading) { // else if loading is false
      idbPromise('products', 'get').then((indexedProducts) => { // call idbPromise with 'products' and 'get' as arguments
        dispatch({ // dispatch UPDATE_PRODUCTS
          type: UPDATE_PRODUCTS, // set type to UPDATE_PRODUCTS
          products: indexedProducts, // set products to indexedProducts
        });
      });
    }
  }, [products, data, loading, dispatch, id]); // pass products, data, loading, dispatch, and id as dependencies

  const addToCart = () => { // define addToCart function
    const itemInCart = cart.find((cartItem) => cartItem._id === id); // set itemInCart to cart.find with cartItem as argument
    if (itemInCart) { // if itemInCart exists
      dispatch({ // dispatch UPDATE_CART_QUANTITY
        type: UPDATE_CART_QUANTITY, // set type to UPDATE_CART_QUANTITY
        _id: id, // set _id to id
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1, // set purchaseQuantity to parseInt(itemInCart.purchaseQuantity) + 1
      });
      idbPromise('cart', 'put', { // call idbPromise with 'cart', 'put', and { ...itemInCart, purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1 } as arguments
        ...itemInCart, // spread itemInCart
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1, // set purchaseQuantity to parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch({ // dispatch ADD_TO_CART
        type: ADD_TO_CART, // set type to ADD_TO_CART
        product: { ...currentProduct, purchaseQuantity: 1 }, // set product to { ...currentProduct, purchaseQuantity: 1 }
      });
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 }); // call idbPromise with 'cart', 'put', and { ...currentProduct, purchaseQuantity: 1 } as arguments
    }
  };

  const removeFromCart = () => { // define removeFromCart function
    dispatch({ // dispatch REMOVE_FROM_CART
      type: REMOVE_FROM_CART, // set type to REMOVE_FROM_CART
      _id: currentProduct._id, // set _id to currentProduct._id
    });

    idbPromise('cart', 'delete', { ...currentProduct }); // call idbPromise with 'cart', 'delete', and { ...currentProduct } as arguments
  };

  return (
    <>
      {currentProduct && cart ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            <button
              disabled={!cart.find((p) => p._id === currentProduct._id)}
              onClick={removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail; // export Detail
