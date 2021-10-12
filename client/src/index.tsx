import React from "react";
import * as serviceWorker from "./serviceWorker";
import ReactDOM from "react-dom";
import App from "./App";
import { store } from "./store";
import { Provider } from "react-redux";
import { Auth0Provider } from "@auth0/auth0-react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./graphql";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <Auth0Provider
          domain={
            process.env.REACT_APP_AUTH0_DOMAIN || "dev-t0rmcnd7.jp.auth0.com"
          }
          clientId={
            process.env.REACT_APP_AUTH0_CLIENT_ID ||
            "gJ7dkN7Cig3tLbH9GrlvKQeMrNjQGXCw"
          }
          redirectUri={
            process.env.REACT_APP_AUTH0_REDIRECT_URL ||
            "http://localhost:3000/login"
          }
          audience={
            process.env.REACT_APP_AUTH0_AUDIENCE ||
            "https://matching-api.trang.com"
          }
        >
          <App />
        </Auth0Provider>
      </ApolloProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
