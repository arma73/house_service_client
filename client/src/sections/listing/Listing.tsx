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
import ListingCreateBookingModal from "./components/listingcreatebookingmodal";
import { Viewer } from "../../lib/types";

interface MatchParams {
    "id": string;
}

interface IProps {
    "viewer": Viewer;
}

const PAGE_LIMIT = 3;

const Listing: FC<IProps & RouteComponentProps<MatchParams>> = ({ match, viewer }) => {
    const [bookingsPage, setBookingsPage] = useState(1);
    const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    
    const { loading, data, error, refetch } = useQuery<ListingData, ListingVariables>(LISTING, {
        "variables": {
            "id": match.params.id,
            "limit": PAGE_LIMIT,
            bookingsPage,
        },
    });

    const clearBookingDate = (): void => {
        setModalVisible(false);
        setCheckInDate(null);
        setCheckOutDate(null);
    };

    const handleListingRefetch = async (): Promise<void> => {
        await refetch();
    };

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
                viewer={viewer}
                host={listing.host}
                price={listing.price}
                bookingsIndex={listing.bookingsIndex}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                setCheckInDate={setCheckInDate}
                setCheckOutDate={setCheckOutDate}
                setModalVisible={setModalVisible}
            />
        )
        : null;

    const listingCreateBookingModalElement = listing && checkInDate && checkOutDate 
        ? (
            <ListingCreateBookingModal
                id={listing.id}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                checkInData={checkInDate}
                checkOutData={checkOutDate}
                price={listing?.price}
                clearBookingDate={clearBookingDate}
                handleListingRefetch={handleListingRefetch}
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
            {listingCreateBookingModalElement}
        </Layout.Content>
    );
};

export default Listing;
