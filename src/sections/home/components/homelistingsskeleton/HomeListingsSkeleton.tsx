import React from "react";
import { List, Card, Skeleton } from "antd";

import listingLoadingCardCover from "../../../../assets/listing-loading-card-cover.jpg";

const HomeListingsSkeleton = () => {
    const emptyData = [{}, {}, {}, {}];
    return (
        <div className="home-listings-skeleton">
            <Skeleton paragraph={{ "rows": 0 }} />
            <List 
                grid={{
                    "gutter": 8,
                    "column": 4,
                }}
                dataSource={emptyData}
                renderItem={() => (
                    <List.Item>
                        <Card 
                            cover={
                                <div 
                                    style={{ "backgroundImage": `url(${listingLoadingCardCover})` }}
                                    className="home-listings-skeleton__card-cover-img"
                                />
                            }
                            loading
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default HomeListingsSkeleton;
