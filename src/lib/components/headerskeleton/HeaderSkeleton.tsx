import React from "react";
import { Layout } from "antd";

import logo from "../../../assets/toHouse-logo.svg";

const HeadeSkeleton = () => (
    <Layout.Header className="app-header">
        <div className="app-header__logo-search-section">
            <div className="app-header__logo">
                <img src={logo} alt="App logo" />
            </div>
        </div>
    </Layout.Header>
);

export default HeadeSkeleton;
