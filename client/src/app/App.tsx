import React, { useState } from "react";
import Routes from "../routes/Routes";
import { StripeProvider } from "react-stripe-elements";
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

const App = () => {
    const [viewer, setViewer] = useState<Viewer>(initialViewer);
    
    return (
        <StripeProvider apiKey={process.env.REACT_APP_S_PUBLISHABLE_KEY as string}>
            <Routes 
                setViewer={setViewer}
                viewer={viewer}
            />
        </StripeProvider>
    );
};

export default App;