import React from "react";
import { render } from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import reportWebVitals from "./reportWebVitals";
import Routes from "./routes/Routes";

import "./temp/styles/index.css";

const client = new ApolloClient({
    "uri": "/api",
});

render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <Routes />
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();
