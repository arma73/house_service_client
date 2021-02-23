import React, { FC } from "react";
import { Alert } from "antd";

interface IProps {
    "message"?: string;
    "description"?: string;
}

const ErrorBanner: FC<IProps> = ({ 
    message = "Uh oh! Something went wrong :(", 
    description = "Look like something went wrong. Please check your connection and/or try again later."
}) => (
    <Alert
        banner
        closable
        message={message}
        description={description}
        type="error"
        className="error-banner"
    />
);

export default ErrorBanner;
