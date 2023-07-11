import React from 'react'; // import React
import { useDispatch } from 'react-redux'; // import useDispatch from react-redux
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from "../../utils/actions"; // import REMOVE_FROM_CART and UPDATE_CART_QUANTITY from utils/actions
import { idbPromise } from "../../utils/helpers"; // import idbPromise from utils/helpers

const CartItem = ({ item }) => { // define CartItem component with item as argument

  const dispatch = useDispatch(); // set dispatch to useDispatch

  const removeFromCart = item => { // define removeFromCart function with item as argument
    dispatch({ // dispatch REMOVE_FROM_CART
      type: REMOVE_FROM_CART, // set type to REMOVE_FROM_CART
      _id: item._id // set _id to item._id
    });
    idbPromise('cart', 'delete', { ...item }); // call idbPromise with 'cart', 'delete', and { ...item } as arguments

  };

  const onChange = (e) => { // define onChange function with e as argument
    const value = e.target.value; // set value to e.target.value
    if (value === '0') { // if value is 0
      dispatch({ // dispatch REMOVE_FROM_CART
        type: REMOVE_FROM_CART, // set type to REMOVE_FROM_CART
        _id: item._id // set _id to item._id
      });
      idbPromise('cart', 'delete', { ...item }); // call idbPromise with 'cart', 'delete', and { ...item } as arguments

    } else {
      dispatch({ // dispatch UPDATE_CART_QUANTITY
        type: UPDATE_CART_QUANTITY, // set type to UPDATE_CART_QUANTITY
        _id: item._id, // set _id to item._id
        purchaseQuantity: parseInt(value) // set purchaseQuantity to parseInt(value)
      });
      idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) }); // call idbPromise with 'cart', 'put', and { ...item, purchaseQuantity: parseInt(value) } as arguments

    }
  }

  return (
    <div className="flex-row">
      <div>
        <img
          src={`/images/${item.image}`}
          alt=""
        />
      </div>
      <div>
        <div>{item.name}, ${item.price}</div>
        <div>
          <span>Qty:</span>
          <input
            type="number"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={onChange}
          />
          <span
            role="img"
            aria-label="trash"
            onClick={() => removeFromCart(item)}
          >
            🗑️
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem; // export CartItem
