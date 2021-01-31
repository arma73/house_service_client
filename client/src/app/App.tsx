import React, { useState } from "react";
import Routes from "../routes/Routes";
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
    return (
        <>
            <Routes />
        </>
    );
};

export default App;