import React, { FC, Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { Layout } from "antd";
import MenuItems from "./components/menuitems";

import logo from "../../assets/toHouse-logo.svg";
import { Viewer } from "../../lib/types";

interface IProps {
    "viewer": Viewer;
    "setViewer": Dispatch<SetStateAction<Viewer>>;
}

const Header: FC<IProps> = ({ viewer, setViewer }) => (
    <Layout.Header className="app-header">
        <div className="app-header__logo-search-section">
            <div className="app-header__logo">
                <Link to="/">
                    <img src={logo} alt="App logo" />
                </Link>
            </div>
        </div>
        <div className="app-header__menu-section">
            <MenuItems viewer={viewer} setViewer={setViewer} />
        </div>
    </Layout.Header>
);

export default Header;
