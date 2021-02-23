import React, { FC, Dispatch, SetStateAction, useState, useEffect } from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { Layout, Input } from "antd";
import MenuItems from "./components/menuitems";
import { displayErrorMessage } from "../../lib/utils/display";

import logo from "../../assets/toHouse-logo.svg";
import { Viewer } from "../../lib/types";

interface IProps {
    "viewer": Viewer;
    "setViewer": Dispatch<SetStateAction<Viewer>>;

}

const Header: FC<IProps & RouteComponentProps> = ({ viewer, setViewer, history, location, match }) => {
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const { pathname } = location;
        const pathnameSubStrings = pathname.split("/");

        if (!pathname.includes("/listings")) {
            setSearch("");
            return;
        }

        if (pathname.includes("/listings") && pathnameSubStrings.length === 3) {
            setSearch(pathnameSubStrings[2]);
            return;
        }
    }, [location]);

    const onSearch = (value: string) => {
        const trimmedValue = value.trim();

        if (trimmedValue) {
            history.push(`/listings/${trimmedValue}`);
        } else {
            displayErrorMessage("Please enter a valid search!");
        }
    };

    return (
        <Layout.Header className="app-header">
            <div className="app-header__logo-search-section">
                <div className="app-header__logo">
                    <Link to="/">
                        <img src={logo} alt="App logo" />
                    </Link>
                </div>
                <div className="app-header__search-input">
                    <Input.Search
                        placeholder="Search 'San Francisco'"
                        enterButton
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onSearch={onSearch}
                    />
                </div>
            </div>
            <div className="app-header__menu-section">
                <MenuItems viewer={viewer} setViewer={setViewer} />
            </div>
        </Layout.Header>
    );
};
export default withRouter(Header);
