import React, { FC } from "react";
import { List, Typography } from "antd";
import ListingCard from "../../../../lib/components/listingcard";
import { User } from "../../../../lib/graphql/queries/user";

interface IProps {
    "userBookings": User["user"]["bookings"];
    "bookingsPage": number;
    "limit": number;
    "setBookingsPage": (page: number) => void;
}

const { Paragraph, Title, Text } = Typography;

const UserBookings: FC<IProps> = ({
    userBookings,
    bookingsPage,
    limit,
    setBookingsPage
}) => {
    const total = userBookings ? userBookings.total : null;
    const result = userBookings ? userBookings.result : null;

    const userBookingsList = userBookings
        ? (
            <List
                grid={{
                    "gutter": 8,
                    "xs": 1,
                    "sm": 2,
                    "lg": 4,
                }}
                dataSource={result ? result : undefined}
                locale={{ "emptyText": "User doesn't have any listings yet!" }}
                pagination={{
                    "position": "top",
                    "current": bookingsPage,
                    "defaultPageSize": limit,
                    "hideOnSinglePage": true,
                    "showLessItems": true,
                    "onChange": (page: number) => setBookingsPage(page),
                    "total": total ? total : undefined,
                }}
                renderItem={userBooking => {
                    const bookingHistory = (
                        <div className="user-bookings__booking-history">
                            <div>
                                Check in: <Text strong>{userBooking.checkIn}</Text>
                            </div>
                            <div>
                                Check out: <Text strong>{userBooking.checkOut}</Text>
                            </div>
                        </div>
                    );

                    return (
                        <List.Item>
                            {bookingHistory}
                            <ListingCard listing={userBooking.listing} />
                        </List.Item>
                    );
                }}
            />
        )
        : null;

    const userBookingsElement = userBookingsList
        ? (
            <div className="user-bookings">
                <Title level={4} className="user-bookings__title">
                    Bookings
                </Title>
                <Paragraph className="user-bookings__description">
                    This section highlights the bookings you've made, and the
                    check-in/check-out dates associated with said bookings.
                </Paragraph>
                {userBookingsList}
            </div>
        )
        : null;

    return userBookingsElement;
};

export default UserBookings;
