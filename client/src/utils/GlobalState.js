import React from "react"; // import React
import { Provider } from "react-redux"; // import Provider from react-redux
import store from "./store"; // import store from ./store

export default function StoreProvider(props) { // define StoreProvider component with props as argument
  // Return the provider component provided by react-redux
  return <Provider store={store} {...props} />;
}
