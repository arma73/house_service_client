import React, { SetStateAction, Dispatch, FC, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Layout, Affix, Spin } from "antd";
import { useMutation } from "@apollo/react-hooks";
import { Viewer } from "../lib/types";
import Header from "../sections/header";
import Home from "../sections/home";
import Host from "../sections/host";
import Listing from "../sections/listing";
import Listings from "../sections/listings";
import User from "../sections/user";
import NotFound from "../sections/notfound";
import LogIn from "../sections/logIn";
import Stripe from "../sections/stripe";
import HeaderSkeleton from "../lib/components/headerskeleton";
import { LOG_IN, LogIn as LogInData, LogInVariables } from "../lib/graphql/mutations/logIn";
import ErrorBanner from "../lib/components/errorbanner";

interface IProps {
    "viewer": Viewer;
    "setViewer": Dispatch<SetStateAction<Viewer>>;
}

const Routes: FC<IProps> = ({ setViewer, viewer }) => {
    const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
        "onCompleted": data => {
            if (data && data.logIn) {
                setViewer(data.logIn);

                if (data.logIn.token) {
                    sessionStorage.setItem("_t", data.logIn.token);
                } else {
                    sessionStorage.removeItem("_t");
                }
            }
        },
    });
    const logInRef = useRef(logIn);

    useEffect(() => {
        logInRef.current();
    }, []);

    if (!viewer.didRequest && !error) {
        return (
            <Layout className="app-skeleton">
                <HeaderSkeleton />
                <div className="app-skeleton__spin-section">
                    <Spin size="large" tip="Launching ToHouse" />
                </div>
            </Layout>
        );
    }

    const logInErrorBannerElement = error 
        ? <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
        : null;

    return (
        <BrowserRouter>
            <Layout id="app">
                {logInErrorBannerElement}
                <Affix offsetTop={0} className="app__affix-header">
                    <Header viewer={viewer} setViewer={setViewer} />
                </Affix>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route 
                        exact 
                        path="/host" 
                        render={props => <Host {...props} viewer={viewer}  />} />
                    <Route exact path="/listing/:id" component={Listing} />
                    <Route exact path="/listings/:location?" component={Listings} />
                    <Route
                        exact
                        path="/login"
                        render={props => <LogIn {...props} setViewer={setViewer} />}
                    />
                    <Route
                        exact
                        path="/stripe"
                        render={props => <Stripe {...props} viewer={viewer} setViewer={setViewer} />}
                    />
                    <Route 
                        exact 
                        path="/user/:id" 
                        render={props => <User {...props} viewer={viewer} setViewer={setViewer} />}
                    />
                    <Route component={NotFound} />
                </Switch>
            </Layout>
        </BrowserRouter>
    );
};

export default Routes;
