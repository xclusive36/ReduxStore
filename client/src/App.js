import React from 'react'; // import React
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // import BrowserRouter as Router, Routes, and Route from react-router-dom
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client'; // import ApolloClient, InMemoryCache, ApolloProvider, and createHttpLink from @apollo/client
import { setContext } from '@apollo/client/link/context'; // import setContext from @apollo/client/link/context

import Home from './pages/Home'; // import Home page
import Detail from './pages/Detail'; // import Detail page
import NoMatch from './pages/NoMatch'; // import NoMatch page
import Login from './pages/Login'; // import Login page
import Signup from './pages/Signup'; // import Signup page
import Nav from './components/Nav'; // import Nav component
import StoreProvider from './utils/GlobalState'; // import StoreProvider from utils/GlobalState
import Success from './pages/Success'; // import Success page
import OrderHistory from './pages/OrderHistory'; // import OrderHistory page

const httpLink = createHttpLink({ // set httpLink to createHttpLink
  uri: '/graphql', // set uri to '/graphql'
});

const authLink = setContext((_, { headers }) => { // set authLink to setContext
  const token = localStorage.getItem('id_token'); // set token to localStorage.getItem('id_token')
  return { // return { headers: { ...headers, authorization: token ? `Bearer ${token}` : '', }, };
    headers: { 
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({ // set client to new ApolloClient
  link: authLink.concat(httpLink), // set link to authLink.concat(httpLink)
  cache: new InMemoryCache(), // set cache to new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <StoreProvider>
            <Nav />
            <Routes>
              <Route 
                path="/" 
                element={<Home />} 
              />
              <Route 
                path="/login" 
                element={<Login />} 
              />
              <Route 
                path="/signup" 
                element={<Signup />} 
              />
              <Route 
                path="/success" 
                element={<Success />} 
              />
              <Route 
                path="/orderHistory" 
                element={<OrderHistory />} 
              />
              <Route 
                path="/products/:id" 
                element={<Detail />} 
              />
              <Route 
                path="*" 
                element={<NoMatch />} 
              />
            </Routes>
          </StoreProvider>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App; // export App
