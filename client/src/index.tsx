import React from "react";
import { render } from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import reportWebVitals from "./reportWebVitals";
import App from "./app";

const client = new ApolloClient({
    "uri": "/api",
    "request": async operation => {
        const token = sessionStorage.getItem("_t");

        operation.setContext({
            "headers": {
                "X-CSRF-TOKEN": token || "",
            },
        });
    },
});

render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();
