const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();
// Local module imports
const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const cors = require('cors');
const mongoose = require('mongoose');  
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Use bcrypt for password hashing

// Run our server on a port specified in our .env file or port 4000
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;
const JWT_SECRET = process.env.JWT_SECRET; // Secret key for JWT
const app = express();
app.use(cors());

// Connect to the database
db.connect(DB_HOST);

// Middleware to extract and verify JWT
app.use((req, res, next) => {
  const token = req.headers.authorization || ''; // Extract token from Authorization header
  if (token) {
    try {
      // Verify the token and attach user info to the request
      const decodedUser = jwt.verify(token, JWT_SECRET);
      req.user = decodedUser; // Attach the decoded user info to the request object
    } catch (err) {
      console.error('Invalid or expired token');
      // Optionally you can send a response here, but we're moving to next to keep the flow
    }
  }
  next();
});

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Pass models and authenticated user info (if available) to the context
    return { models, user: req.user };
  }
});

// Apply the Apollo GraphQL middleware and set the path to /api
async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/api' });

  app.listen({ port }, () =>
    console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`)
  );
}

startServer();
