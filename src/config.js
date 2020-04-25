const localConfig = {
  GRAPHQL_URI: "http://localhost:8000/graphql/",
};

const productionConfig = {
  GRAPHQL_URI: "http://35.245.31.28:8000/graphql/",
};

const config =
  process.env.REACT_APP_BUILD_ENV === "production"
    ? productionConfig
    : localConfig;

console.log(
  process.env.REACT_APP_BUILD_ENV,
  config,
  process.env.REACT_APP_BUILD_ENV === "production"
);
export default {
  ...config,
};
