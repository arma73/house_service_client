import React, { FC } from "react";
import { Link } from "react-router-dom";
import { List, Typography, Avatar, Divider } from "antd";
import { Listing } from "../../../../lib/graphql/queries/listing";

interface IProps {
    "listingBookings": Listing["listing"]["bookings"];
    "bookingsPage": number;
    "limit": number;
    "setBookingsPage": (page: number) => void;
}

const { Title, Text } = Typography;

const ListingBookings: FC<IProps> = ({
    listingBookings,
    bookingsPage,
    limit,
    setBookingsPage
}) => {
    const total = listingBookings ? listingBookings.total : null;
    const result = listingBookings ? listingBookings.result : null;

    const listingBookingsList = listingBookings
        ? (
            <List
                grid={{
                    "gutter": 8,
                    "column": 3,
                }}
                dataSource={result ? result : undefined}
                locale={{ "emptyText": "User doesn't have any listings yet!" }}
                pagination={{
                    "current": bookingsPage,
                    "defaultPageSize": limit,
                    "hideOnSinglePage": true,
                    "showLessItems": true,
                    "onChange": (page: number) => setBookingsPage(page),
                    "total": total ? total : undefined,
                }}
                renderItem={listingBooking => {
                    const bookingHistory = (
                        <div className="listing-bookings__history">
                            <div>
                                Check in: <Text strong>{listingBooking.checkIn}</Text>
                            </div>
                            <div>
                                Check out: <Text strong>{listingBooking.checkOut}</Text>
                            </div>
                        </div>
                    );

                    return (
                        <List.Item className="listing-bookings__item">
                            {bookingHistory}
                            <Link to={`/user/${listingBooking.tenant.id}`}>
                                <Avatar 
                                    src={listingBooking.tenant.avatar}
                                    size={64}
                                    shape="square"
                                />
                            </Link>
                        </List.Item>
                    );
                }}
            />
        )
        : null;

    const listingBookingsElement = listingBookingsList
        ? (
            <div className="listing-bookings">
                <Divider />
                <div className="listing-bookings__section">
                    <Title level={4}>
                        Bookings
                    </Title>
                </div>
                {listingBookingsList}
            </div>
        )
        : null;

    return listingBookingsElement;
};

export default ListingBookings;
