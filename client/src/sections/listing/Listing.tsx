import React, { FC, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Layout, Col, Row } from "antd";
import { Moment } from "moment";
import PageSkeleton from "../../lib/components/pageskeleton";
import ErrorBanner from "../../lib/components/errorbanner";
import { LISTING, ListingVariables, Listing as ListingData } from "../../lib/graphql/queries/listing";
import ListingDetails from "./components/listingdetails";
import ListingBookings from "./components/listingbookings";
import ListingCreateBooking from "./components/listingcreatebooking";

interface MatchParams {
    "id": string;
}

const PAGE_LIMIT = 3;

const Listing: FC<RouteComponentProps<MatchParams>> = ({ match }) => {
    const [bookingsPage, setBookingsPage] = useState(1);
    const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);
    
    const { loading, data, error } = useQuery<ListingData, ListingVariables>(LISTING, {
        "variables": {
            "id": match.params.id,
            "limit": PAGE_LIMIT,
            bookingsPage,
        },
    });

    if (loading) {
        return (
            <Layout.Content className="listings">
                <PageSkeleton />
            </Layout.Content>
        );
    }

    if (error) {
        return (
            <Layout.Content>
                <ErrorBanner 
                    description="This listing may not exist or we've encountered an error. Please try again soon!"
                />
                <PageSkeleton />
            </Layout.Content>
        );
    }
    
    const listing = data ? data.listing : null;
    const listingBookings = listing ? listing.bookings : null;
    
    const listingDetailsElement = listing 
        ? <ListingDetails listing={listing} />
        : null;

    const listingBookingsElement = listingBookings
        ? (
            <ListingBookings 
                listingBookings={listingBookings}
                bookingsPage={bookingsPage}
                limit={PAGE_LIMIT}
                setBookingsPage={setBookingsPage}
            />
        )
        : null;

    const listingCreateBookingElement = listing 
        ? (
            <ListingCreateBooking 
                price={listing.price}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                setCheckInDate={setCheckInDate}
                setCheckOutDate={setCheckOutDate}
            />
        )
        : null;
    
    return (
        <Layout.Content className="listings">
            <Row gutter={24} justify="space-between">
                <Col xs={24} lg={14}>
                    {listingDetailsElement}
                    {listingBookingsElement}
                </Col>
                <Col xs={24} lg={10}>
                    {listingCreateBookingElement}
                </Col>
            </Row>
        </Layout.Content>
    );
};

export default Listing;
