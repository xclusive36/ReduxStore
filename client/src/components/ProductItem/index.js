import React from "react"; // import React
import { Link } from "react-router-dom"; // import Link from react-router-dom
import { pluralize } from "../../utils/helpers" // import pluralize from utils/helpers
import { useDispatch, useSelector } from 'react-redux'; // import useDispatch and useSelector from react-redux
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from "../../utils/actions"; // import ADD_TO_CART and UPDATE_CART_QUANTITY from utils/actions
import { idbPromise } from "../../utils/helpers"; // import idbPromise from utils/helpers

function ProductItem(item) { // define ProductItem component with item as argument
  const dispatch = useDispatch(); // set dispatch to useDispatch
  const state = useSelector((state) => state); // set state to useSelector with state as argument

  const {
    image,
    name,
    _id,
    price,
    quantity
  } = item; // destructure item

  const { cart } = state // destructure cart from state

  const addToCart = () => { // define addToCart function
    const itemInCart = cart.find((cartItem) => cartItem._id === _id) // set itemInCart to cart.find with cartItem as argument
    if (itemInCart) { // if itemInCart exists
      dispatch({ // dispatch UPDATE_CART_QUANTITY
        type: UPDATE_CART_QUANTITY, // set type to UPDATE_CART_QUANTITY
        _id: _id, // set _id to _id
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1 // set purchaseQuantity to parseInt(itemInCart.purchaseQuantity) + 1
      }); // call idbPromise with 'cart', 'put', and { ...itemInCart, purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1 } as arguments
      idbPromise('cart', 'put', { // call idbPromise with 'cart', 'put', and { ...itemInCart, purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1 } as arguments
        ...itemInCart, // spread itemInCart
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1 // set purchaseQuantity to parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch({ // dispatch ADD_TO_CART
        type: ADD_TO_CART, // set type to ADD_TO_CART
        product: { ...item, purchaseQuantity: 1 } // set product to { ...item, purchaseQuantity: 1 }
      });
      idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 }); // call idbPromise with 'cart', 'put', and { ...item, purchaseQuantity: 1 } as arguments
    }
  }

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
}

export default ProductItem; // export ProductItem
