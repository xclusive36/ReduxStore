const express = require('express'); // import express
const { ApolloServer } = require('apollo-server-express'); // import ApolloServer
const path = require('path'); // import path
const { authMiddleware } = require('./utils/auth'); // import authMiddleware function

const { typeDefs, resolvers } = require('./schemas'); // import typeDefs and resolvers
const db = require('./config/connection'); // import connection to database

const PORT = process.env.PORT || 3001; // set PORT to process.env.PORT or 3001
const app = express(); // instantiate express app
const server = new ApolloServer({ // instantiate Apollo server
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: false })); // add middleware
app.use(express.json()); // add middleware

// Serve up static assets
app.use('/images', express.static(path.join(__dirname, '../client/images')));

if (process.env.NODE_ENV === 'production') { // if NODE_ENV is production
  app.use(express.static(path.join(__dirname, '../client/build'))); // serve up static assets
}

app.get('/', (req, res) => { // create GET route
  res.sendFile(path.join(__dirname, '../client/build/index.html')); // send index.html
});


// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start(); // start Apollo server
  server.applyMiddleware({ app }); // apply Apollo server to Express app
  
  db.once('open', () => { // connect to database
    app.listen(PORT, () => { // listen for connection
      console.log(`API server running on port ${PORT}!`); // console.log that server is running
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`); // console.log that GraphQL is running
    })
  })
  };
  
// Call the async function to start the server
  startApolloServer();
