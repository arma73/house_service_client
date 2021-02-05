import React, { useState } from "react";
import Routes from "../routes/Routes";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Viewer } from "../lib/types";

import "antd/dist/antd.css";
import "./style.css";

const initialViewer: Viewer = {
    "id": null,
    "token": null,
    "avatar": null,
    "hasWallet": null,
    "didRequest": false,
};

const stripePromise = loadStripe(process.env.REACT_APP_S_PUBLISHABLE_KEY as string);

const App = () => {
    const [viewer, setViewer] = useState<Viewer>(initialViewer);
    
    return (
        <Elements stripe={stripePromise}>
            <Routes 
                setViewer={setViewer}
                viewer={viewer}
            />
        </Elements>
    );
};

export default App;