import React, { FC } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Col, Layout, Row } from "antd";
import UserProfile from "./components/userprofile";
import PageSkeleton from "../../lib/components/pageskeleton";
import ErrorBanner from "../../lib/components/errorbanner";
import { USER, User as UserData, UserVariables } from "../../lib/graphql/queries/user";
import { Viewer } from "../../lib/types";
import { useQuery } from "@apollo/react-hooks";

interface IProps {
    "viewer": Viewer;
}
interface MatchParams {
    "id": string;
}

const User: FC<RouteComponentProps<MatchParams> & IProps> = ({ match, viewer }) => {
    const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
        "variables": {
            "id": match.params.id,
        }
    });

    if (loading) {
        return (
            <Layout.Content className="user">
                <PageSkeleton />
            </Layout.Content>
        );
    }

    if (error) {
        return (
            <Layout.Content>
                <ErrorBanner 
                    description="This user may not exist or we're encountered an error. Please try again soon."
                />
                <PageSkeleton />
            </Layout.Content>
        );
    }

    const user = data ? data.user : null;
    const isViewerUser = viewer.id === match.params.id;
    const userProfileElement = user 
        ? <UserProfile user={user} isViewerUser={isViewerUser} /> 
        : null;

    return (
        <Layout.Content className="user">
            <Row gutter={12} typeof="flex" justify="space-between">
                <Col xs={24}>{userProfileElement}</Col>
            </Row>
        </Layout.Content>
    );
};

export default User;
