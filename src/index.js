import React from "react";
import ReactDOM from "react-dom";
import "./static/css/bootstrap.min.css";
import "./static/css/styles.scss";
import "./static/css/riskRegister.css";
import "./static/css/tabulator_bootstrap.css";
// import "./index.css";
import { Provider } from "react-redux";

import { ApolloProvider } from "@apollo/react-hooks";
import { store, persistor } from "./services/redux/make-store";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import GraphQLClient from "./services/graphql/graphql-config";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import Login from "./screens/login/login";
import Activate from "./pages/activate-user";
import ForgotPassword from "./pages/forgot-password";

import CheckDevice from "./pages/login";
ReactDOM.render(
  <ApolloProvider client={GraphQLClient}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route path="/activate-user" component={Activate} />
            <Route path="/forgot-password" component={ForgotPassword} />

            <Route path="/" component={App} />
          </Switch>
        </Router>
      </PersistGate>
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
