import React, { useEffect } from 'react'; // import React and useEffect hook
import { useMutation } from '@apollo/client'; // import useMutation from @apollo/client
import Jumbotron from '../components/Jumbotron'; // import Jumbotron component
import { ADD_ORDER } from '../utils/mutations'; // import ADD_ORDER from utils/mutations
import { idbPromise } from '../utils/helpers'; // import idbPromise from utils/helpers

function Success() { // define Success component
  const [addOrder] = useMutation(ADD_ORDER); // set addOrder to useMutation with ADD_ORDER as argument

  useEffect(() => { // define useEffect hook
    async function saveOrder() { // define saveOrder function
      const cart = await idbPromise('cart', 'get'); // set cart to await idbPromise with 'cart' and 'get' as arguments
      const products = cart.map((item) => item._id); // set products to cart.map with item as argument

      if (products.length) { // if products.length is truthy
        const { data } = await addOrder({ variables: { products } }); // set data to await addOrder with { variables: { products } } as argument
        const productData = data.addOrder.products; // set productData to data.addOrder.products

        productData.forEach((item) => { // for each item in productData
          idbPromise('cart', 'delete', item); // call idbPromise with 'cart', 'delete', and item as arguments
        });
      }

      setTimeout(() => { // set timeout
        window.location.assign('/'); // redirect to home page
      }, 3000); // after 3 seconds
    }

    saveOrder(); // call saveOrder
  }, [addOrder]); // pass addOrder as dependency

  return (
    <div>
      <Jumbotron>
        <h1>Success!</h1>
        <h2>Thank you for your purchase!</h2>
        <h2>You will now be redirected to the home page</h2>
      </Jumbotron>
    </div>
  );
}

export default Success; // export Success
