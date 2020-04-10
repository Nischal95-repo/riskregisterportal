import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import config from "../../config";
// Instantiate required constructor fields
const cache = new InMemoryCache();
const link = new HttpLink({
  uri: config.GRAPHQL_URI
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
      userType: userType ? `${userType}` : ""
    }
  };
});

const client = new ApolloClient({
  connectToDevTools: process.browser,
  ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
  link: authLink.concat(link),
  cache: cache
});

export default client;
