import React, { FC } from "react";
import { List, Typography } from "antd";
import ListingCard from "../../../../lib/components/listingcard";
import { Listings } from "../../../../lib/graphql/queries/listings";

const { Title } = Typography;

interface IProps {
    "title": string;
    "listings": Listings["listings"]["result"];
}

const HomeListings: FC<IProps> = ({ title, listings }) => {
    return (
        <div className="home-listings">
            <Title level={4} className="home-listings__title">
                {title}
            </Title>
            <List 
                grid={{
                    "gutter": 8,
                    "column": 4,
                }}
                dataSource={listings}
                renderItem={listing => (
                    <List.Item>
                        <ListingCard listing={listing} />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default HomeListings;
