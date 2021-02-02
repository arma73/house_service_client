import React, { FC } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Layout, List, Typography } from "antd";
import ListingCard from "../../lib/components/listingcard";
import { LISTINGS, Listings as ListingsData, ListingsVariables } from "../../lib/graphql/queries/listings";
import { ListingsFilter } from "../../lib/graphql/globalTypes";

const { Title, Paragraph, Text } = Typography;

interface MatchParams {
    "location": string;
}

const PAGE_LIMIT = 8;

const Listings: FC<RouteComponentProps<MatchParams>> = ({ match }) => {
    const { data } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
        "variables": {
            "location": match.params.location,
            "filter": ListingsFilter.PRICE_LOW_TO_HIGH,
            "limit": PAGE_LIMIT,
            "page": 1,
        },
    });

    const listings = data ? data.listings : null;
    const listingsRegion = listings ? listings.region : null;
    const listingsSectionElement = listings && listings.result.length
        ? (
            <List 
                grid={{
                    "gutter": 8,
                    "column": 4,
                }}
                dataSource={listings.result}
                renderItem={listing => (
                    <List.Item>
                        <ListingCard listing={listing} />
                    </List.Item>
                )}
            />
        )
        : (
            <div>
                <Paragraph>
                    It appears that no listings have yet been created for{" "}
                    <Text mark>"{listingsRegion}"</Text>
                </Paragraph>
                <Paragraph>
                    Be the first person to create a <Link to="/host"> listing in this area </Link>!
                </Paragraph>
            </div>
        );

    const listingsRegionElement = listingsRegion
        ? (
            <Title level={3} className="listings__title">
                Results for "{listingsRegion}"
            </Title>
        )
        : null;

    return (
        <Layout.Content className="listings">
            {listingsSectionElement}
        </Layout.Content>
    );
};

export default Listings;
