import React, { FC, useState, useEffect, useRef } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Layout, List, Typography, Affix } from "antd";
import ListingsFilters from "./components/listingsfilters";
import ListingsPagination from "./components/listingspagination";
import ListingCard from "../../lib/components/listingcard";
import ErrorBanner from "../../lib/components/errorbanner";
import ListingSkeleton from "./components/listingsskeleton";
import { LISTINGS, Listings as ListingsData, ListingsVariables } from "../../lib/graphql/queries/listings";
import { ListingsFilter } from "../../lib/graphql/globalTypes";

const { Title, Paragraph, Text } = Typography;

interface MatchParams {
    "location": string;
}

const PAGE_LIMIT = 8;

const Listings: FC<RouteComponentProps<MatchParams>> = ({ match }) => {
    const locationRef = useRef(match.params.location);
    const [filter, setFilter] = useState<ListingsFilter>(ListingsFilter.PRICE_LOW_TO_HIGH);
    const [page, setPage] = useState(1);

    const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
        "skip": locationRef.current !== match.params.location && page !== 1,
        "variables": {
            "location": match.params.location,
            "limit": PAGE_LIMIT,
            page,
            filter,
        },
    });

    useEffect(() => {
        setPage(1);
        locationRef.current = match.params.location;
    }, [match.params.location]);

    if (loading) {
        return (
            <Layout.Content className="listings">
                <ListingSkeleton />
            </Layout.Content>
        );
    }

    if (error) {
        return (
            <Layout.Content className="listings">
                <ErrorBanner 
                    description="We either couldn't find anything matching your search or have encountered an error. If you're searching for a unique location, try searching again with more common keywords."
                />
                <ListingSkeleton />
            </Layout.Content>
        );
    }

    const listings = data ? data.listings : null;
    const listingsRegion = listings ? listings.region : null;
    const listingsSectionElement = listings && listings.result.length
        ? (
            <div>
                <Affix offsetTop={64}>
                    <ListingsPagination
                        total={listings.total}
                        page={page}
                        limit={PAGE_LIMIT}
                        setPage={setPage}
                    />
                    <ListingsFilters filter={filter} setFilter={setFilter} />
"                </Affix>
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
            </div>
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
            {listingsRegionElement}
            {listingsSectionElement}
        </Layout.Content>
    );
};

export default Listings;
