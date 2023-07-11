import React, { useEffect } from 'react'; // import React and useEffect hook
import { useQuery } from '@apollo/client'; // import useQuery from @apollo/client
import { useDispatch, useSelector } from 'react-redux'; // import useDispatch and useSelector from react-redux
import {
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
} from '../../utils/actions'; // import UPDATE_CATEGORIES and UPDATE_CURRENT_CATEGORY from utils/actions
import { QUERY_CATEGORIES } from '../../utils/queries'; // import QUERY_CATEGORIES from utils/queries
import { idbPromise } from '../../utils/helpers'; // import idbPromise from utils/helpers

function CategoryMenu() { // define CategoryMenu component
  const dispatch = useDispatch(); // set dispatch to useDispatch
  const state = useSelector((state) => state); // set state to useSelector with state as argument

  const { categories } = state; // set categories to state.categories

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES); // set loading and categoryData to useQuery with QUERY_CATEGORIES as argument

  useEffect(() => { // define useEffect hook
    if (categoryData) { // if categoryData exists
      dispatch({ // dispatch UPDATE_CATEGORIES
        type: UPDATE_CATEGORIES, // set type to UPDATE_CATEGORIES
        categories: categoryData.categories, // set categories to categoryData.categories
      });
      categoryData.categories.forEach((category) => { // for each category in categoryData.categories
        idbPromise('categories', 'put', category); // call idbPromise with 'categories', 'put', and category as arguments
      });
    } else if (!loading) { // else if loading is false
      idbPromise('categories', 'get').then((categories) => { // call idbPromise with 'categories' and 'get' as arguments
        dispatch({ // dispatch UPDATE_CATEGORIES
          type: UPDATE_CATEGORIES, // set type to UPDATE_CATEGORIES
          categories: categories, // set categories to categories
        });
      });
    }
  }, [categoryData, loading, dispatch]); // pass categoryData, loading, and dispatch as dependencies

  const handleClick = (id) => { // define handleClick function with id as argument
    dispatch({ // dispatch UPDATE_CURRENT_CATEGORY
      type: UPDATE_CURRENT_CATEGORY, // set type to UPDATE_CURRENT_CATEGORY
      currentCategory: id, // set currentCategory to id
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu; // export CategoryMenu
