import { ApolloServer, gql } from "apollo-server";
import openBrowser from "open";
import graphql from "../build/graphql";
import { mocks as defMocks } from "../build";

// A map of functions which return data for the schema.
const resolvers = {};

const mocks = {
  Query: () => ({
    version: () => "0.0.1-pre-alpha",
  }),
  Node: () => {
    const node = defMocks.node();
    console.log(node);
    console.log(node.__typename);
    return node;
  },
  ID: () => {
    return defMocks.node().id;
  },
};

const server = new ApolloServer({
  typeDefs: graphql as ReturnType<typeof gql>,
  resolvers,
  mocks,
  tracing: true,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  openBrowser(url);
});
