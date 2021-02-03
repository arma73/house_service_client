import React, { useEffect, useRef, FC, Dispatch, SetStateAction } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Layout, Spin } from "antd";
import {
    CONNECT_STRIPE,
    ConnectStripe as ConnectStripeData,
    ConnectStripeVariables 
} from "../../lib/graphql/mutations/connectstripe";
import { displaySuccessNotification } from "../../lib/utils/display";
import { Viewer } from "../../lib/types";

interface IProps {
    "viewer": Viewer;
    "setViewer": Dispatch<SetStateAction<Viewer>>;
}

const Stripe: FC<IProps & RouteComponentProps> = ({ viewer, setViewer, history }) => {
    const [ connectStripe, { data, loading, error } ] = useMutation<
        ConnectStripeData, 
        ConnectStripeVariables
    >(CONNECT_STRIPE, {
        "onCompleted": data => {
            if (data && data.connectStripe) {
                setViewer(prevState => ({ ...prevState, "hasWallet": data.connectStripe.hasWallet }));
                displaySuccessNotification(
                    "You've successfully connected your Stripe Account!",
                    "You can now begin to create listings in the Host page."
                );
            }
        },
    });
    const connectStripeRef = useRef(connectStripe);


    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");

        if (code) {
            connectStripeRef.current({
                "variables": {
                    "input": { code }
                },
            });
        } else {
            history.replace("/login")
        }
    }, [history]);

    if (data && data.connectStripe) {
        return <Redirect to={`/user/${viewer.id}`} />;
    }

    if (loading) {
        return (
            <Layout.Content className="stripe">
                <Spin size="large" tip="Connecting your Stripe account..." />
            </Layout.Content>
        );
    }

    if (error) {
        return <Redirect to={`/user/${viewer.id}?stripe_error=true`} />;
    }
    
    return null;
};

export default Stripe;
