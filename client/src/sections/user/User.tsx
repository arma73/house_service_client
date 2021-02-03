import React, { FC, SetStateAction, useState, Dispatch } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Col, Layout, Row } from "antd";
import UserProfile from "./components/userprofile";
import UserListings from "./components/userlistings";
import UserBookings from "./components/userbookings";
import PageSkeleton from "../../lib/components/pageskeleton";
import ErrorBanner from "../../lib/components/errorbanner";
import { USER, User as UserData, UserVariables } from "../../lib/graphql/queries/user";
import { Viewer } from "../../lib/types";
import { useQuery } from "@apollo/react-hooks";

interface IProps {
    "viewer": Viewer;
    "setViewer": Dispatch<SetStateAction<Viewer>>
}
interface MatchParams {
    "id": string;
}

const PAGE_LIMIT = 4;

const User: FC<RouteComponentProps<MatchParams> & IProps> = ({ match, viewer, setViewer }) => {
    const [listingsPage, setListingsPage] = useState(1);
    const [bookingsPage, setBookingsPage] = useState(1);

    const { data, loading, error, refetch } = useQuery<UserData, UserVariables>(USER, {
        "variables": {
            "id": match.params.id,
            "limit": PAGE_LIMIT,
            bookingsPage,
            listingsPage,
        }
    });

    const handleUserRefetch = async (): Promise<void> => {
        await refetch();
    };

    const stripeError = new URL(window.location.href).searchParams.get("stripe_error");
    const stripeErrorBanner = stripeError 
        ? (
            <ErrorBanner 
                description="We had an issue connecting with Stripe. Please try again soon."
            />
        )
        : null;

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

    const userListings = user
        ? user.listings
        : null;
    const userBookings = user
        ? user.bookings
        : null;

    const userProfileElement = user
        ? (
            <UserProfile 
                user={user} 
                isViewerUser={isViewerUser} 
                setViewer={setViewer}
                handleUserRefetch={handleUserRefetch}
            />
        )
        : null;

    const userListingsElement = userListings
        ? (
            <UserListings
                userListings={userListings}
                listingsPage={listingsPage}
                limit={PAGE_LIMIT}
                setListingsPage={setListingsPage}
            />
        )
        : null;

    const userBookingsElement = userBookings
        ? (
            <UserBookings
                userBookings={userBookings}
                bookingsPage={bookingsPage}
                limit={PAGE_LIMIT}
                setBookingsPage={setBookingsPage}
            />
        )
        : null;

    return (
        <Layout.Content className="user">
            {stripeErrorBanner}
            <Row gutter={12} justify="space-between">
                <Col xs={24}>{userProfileElement}</Col>
                <Col xs={24}>
                    {userListingsElement}
                    {userBookingsElement}
                </Col>
            </Row>
        </Layout.Content>
    );
};

export default User;
