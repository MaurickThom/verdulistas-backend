const { ApolloServer } = require('apollo-server-express');
const { resolvers, typeDefs } = require('./src');
// Applications models
const models = require('./database');
// Auth service
const auth = require('./auth');
// Email service
const sendMailForCreatedOrder = require('./helpers/email');
// Application data loaders
const loaders = require('./loaders');

module.exports = function setupApolloServer(app) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    context: ({ req }) => {
      const user = auth.getUserByToken(req.headers.token);

      return {
        ...models,
        auth,
        user,
        loaders,
        sendMailForCreatedOrder,
      };
    },
  });

  server.applyMiddleware({ app, path: '/graphql' });
};
