import React, { useEffect } from 'react'; // import React and useEffect hook
import { loadStripe } from '@stripe/stripe-js'; // import loadStripe from @stripe/stripe-js
import { useLazyQuery } from '@apollo/client'; // import useLazyQuery from @apollo/client
import { QUERY_CHECKOUT } from '../../utils/queries'; // import QUERY_CHECKOUT from utils/queries
import { idbPromise } from '../../utils/helpers'; // import idbPromise from utils/helpers
import CartItem from '../CartItem'; // import CartItem component
import Auth from '../../utils/auth'; // import Auth from utils/auth
import { useDispatch, useSelector } from 'react-redux'; // import useDispatch and useSelector from react-redux
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions'; // import TOGGLE_CART and ADD_MULTIPLE_TO_CART from utils/actions
import './style.css'; // import style.css

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx'); // set stripePromise to loadStripe with pk_test_TYooMQauvdEDq54NiTphI7jx

const Cart = () => { // define Cart component
  const dispatch = useDispatch(); // set dispatch to useDispatch
  const state = useSelector((state) => state); // set state to useSelector with state as argument
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT); // set getCheckout and data to useLazyQuery with QUERY_CHECKOUT as argument

  useEffect(() => { // define useEffect hook
    if (data) { // if data exists
      stripePromise.then((res) => { // call stripePromise.then with res as argument
        res.redirectToCheckout({ sessionId: data.checkout.session }); // call redirectToCheckout on res with data.checkout.session as argument
      });
    }
  }, [data]); // pass data as dependency

  useEffect(() => { // define useEffect hook
    async function getCart() { // define getCart function
      const cart = await idbPromise('cart', 'get'); // set cart as idbPromise with 'cart' and 'get' as arguments
      dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] }); // dispatch ADD_MULTIPLE_TO_CART with cart as argument
    }

    if (!state.cart.length) { // if state.cart.length is 0
      getCart(); // call getCart
    }
  }, [state.cart.length, dispatch]); // pass state.cart.length and dispatch as dependencies

  function toggleCart() { // define toggleCart function
    dispatch({ type: TOGGLE_CART }); // dispatch TOGGLE_CART
  }

  function calculateTotal() { // define calculateTotal function
    let sum = 0; // set new variable sum to 0
    state.cart.forEach((item) => { // for each item in state.cart
      sum += item.price * item.purchaseQuantity; // add item.price * item.purchaseQuantity to sum
    });
    return sum.toFixed(2); // return sum.toFixed(2)
  }

  function submitCheckout() { // define submitCheckout function
    const productIds = []; // set new variable productIds to empty array

    state.cart.forEach((item) => { // for each item in state.cart
      for (let i = 0; i < item.purchaseQuantity; i++) { // loop through item.purchaseQuantity
        productIds.push(item._id); // push item._id to productIds
      }
    });

    getCheckout({ // call getCheckout query
      variables: { products: productIds }, // set variables to { products: productIds }
    });
  }

  if (!state.cartOpen) { // if state.cartOpen is false
    return (
      <div className="cart-closed" onClick={toggleCart}>
        <span role="img" aria-label="trash">
          🛒
        </span>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="close" onClick={toggleCart}>
        [close]
      </div>
      <h2>Shopping Cart</h2>
      {state.cart.length ? (
        <div>
          {state.cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}

          <div className="flex-row space-between">
            <strong>Total: ${calculateTotal()}</strong>

            {Auth.loggedIn() ? (
              <button onClick={submitCheckout}>Checkout</button>
            ) : (
              <span>(log in to check out)</span>
            )}
          </div>
        </div>
      ) : (
        <h3>
          <span role="img" aria-label="shocked">
            😱
          </span>
          You haven't added anything to your cart yet!
        </h3>
      )}
    </div>
  );
};

export default Cart; // export Cart component
