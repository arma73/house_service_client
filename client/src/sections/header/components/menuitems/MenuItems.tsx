import React, { FC, Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Avatar, Button, Menu } from "antd";
import { HomeFilled, LogoutOutlined } from "@ant-design/icons";
import { Viewer } from "../../../../lib/types";
import { displaySuccessNotification, displayErrorMessage } from "../../../../lib/utils/display";
import { LOG_OUT, LogOut as LogOutData } from "../../../../lib/graphql/mutations/logOut";

const { Item, SubMenu } = Menu;

interface IProps {
    "viewer": Viewer;
    "setViewer": Dispatch<SetStateAction<Viewer>>;
}

const MenuItems: FC<IProps> = ({ viewer, setViewer }) => {
    const [logOut] = useMutation<LogOutData>(LOG_OUT, {
        "onCompleted": (data) => {
            if (data && data.logOut) {
                setViewer(data.logOut);
                displaySuccessNotification("You've successfully logged out!");
            }
        },
        "onError": () => {
            displayErrorMessage("Sorry! We weren't able to log you out. Please try again later!");
        },
    });

    const handleLogOut = () => {
        logOut();
    };

    const subMenuLogin = viewer.id && viewer.avatar
        ? (
            <SubMenu title={<Avatar src={viewer.avatar} />}>
                <Item key="/user">
                    <Link to={`/user/${viewer.id}`}>
                        <HomeFilled />
                        Profile
                    </Link>
                </Item>
                <Item key="/logout">
                    <div onClick={handleLogOut}>
                        <LogoutOutlined />
                        Log out
                    </div>
                </Item>
            </SubMenu>
        )
        : (
            <Item>
                <Link to="/login">
                    <Button type="primary">Sign In</Button>
                </Link>
            </Item>
        );

    return (
        <Menu mode="horizontal" selectable={false} className="menu">
            <Item key="/host">
                <Link to="/host">
                    <HomeFilled />
                    Host
                </Link>
            </Item>
            {subMenuLogin}
        </Menu>
    );
};
export default MenuItems;
