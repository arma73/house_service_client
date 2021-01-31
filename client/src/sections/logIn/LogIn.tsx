import React from "react";
import { Card, Layout, Typography } from "antd";

import GoogleLogo from "../../assets/google_logo.jpg";

const { Content } = Layout;
const { Text, Title } = Typography;

const LogIn = () => (
    <Content className="log-in">
        <Card className="log-in-card">
            <div className="log-in-card__intro">
                <Title level={3} className="log-in-card__intro-title">
                    <span role="img" aria-label="wave">
                        👋
                    </span>
                </Title>
                <Title level={3} className="log-in-card__intro-title">
                    Log in to ToHouse!
                </Title>
                <Text>Sign in with Google to start booking available rentals!</Text>
            </div>
            <button className="log-in-card__google-button">
                <img src={GoogleLogo} alt="Google Logo" className="log-in-card__google-button-logo" />
                <span className="log-in-card__google-button-text">
                    Sign in with Google
                </span>
            </button>
            <Text type="secondary">
                Note: By signing in, you'll be redirected to the Google consent from
                to sign in with your Google account
            </Text>
        </Card>
    </Content>
);

export default LogIn;
