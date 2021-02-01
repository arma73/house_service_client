import React, { FC } from "react";
import { List, Typography } from "antd";
import ListingCard from "../../../../lib/components/listingcard";
import { User } from "../../../../lib/graphql/queries/user";

interface IProps {
    "userListings": User["user"]["listings"];
    "listingsPage": number;
    "limit": number;
    "setListingsPage": (page: number) => void;
}

const { Paragraph, Title } = Typography;

const UserListings: FC<IProps> = ({
    userListings,
    listingsPage,
    limit,
    setListingsPage
}) => {
    const { result, total } = userListings;

    const userListingsList = (
        <List 
            grid={{
                "gutter": 8,
                "xs": 1,
                "sm": 2,
                "lg": 4,
            }}
            dataSource={result}
            locale={{ "emptyText": "User doesn't have any listings yet!" }}
            pagination={{
                "position": "top",
                "current": listingsPage,
                "defaultPageSize": limit,
                "hideOnSinglePage": true,
                "showLessItems": true,
                "onChange": (page: number) => setListingsPage(page),
                total,
            }}
            renderItem={userListing => (
                <List.Item>
                    <ListingCard listing={userListing} />
                </List.Item>
            )}
        />
    );

    return (
        <div className="user-listings">
            <Title level={4} className="user-listings__title">
                Listings
            </Title>
            <Paragraph className="user-listings__description">
                This section highlights the listings this user currently hosts and has 
                made available for bookings.
            </Paragraph>
            {userListingsList}
        </div>
    );
};

export default UserListings;
