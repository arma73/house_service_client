import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Avatar, Divider, Tag, Typography } from "antd";
import { EnvironmentFilled } from "@ant-design/icons";
import { Listing as ListingData } from "../../../../lib/graphql/queries/listing";
import { iconColor } from "../../../../lib/theme/color";

interface IProps {
    "listing": ListingData["listing"];
}

const { Paragraph, Title } = Typography;

const ListingDetails: FC<IProps> = ({ listing }) => {
    const { address, numOfGuests, type, city, description, host, image, title } = listing;
    
    return (
        <div className="listing-details">
            <div style={{ "backgroundImage": `url(${image})` }} className="listing-details__image" />

            <div className="listing-details__information">
                <Paragraph
                    type="secondary"
                    ellipsis
                    className="listing-details__city-address"
                >
                    <Link to={`/listings/${city}`}>
                        <EnvironmentFilled style={{ "color": iconColor }} /> {city}
                    </Link>
                    <Divider type="vertical" />
                    {address}
                </Paragraph>
                <Title level={3} className="listing-details__title">
                    {title}
                </Title>
            </div>
            <Divider />
            <div className="listing-details__section">
                <Link to={`/user/${host.id}`}>
                    <Avatar src={host.avatar} size={64} />
                    <Title level={2} className="listing-details__host-name">
                        {host.name}
                    </Title>
                </Link>
            </div>
            <Divider />
            <div className="listing-details__section">
                <Title level={4}>
                    About this space
                </Title>
                <div className="listing-details__about-items">
                    <Tag color="magenta">{type}</Tag>
                    <Tag color="magenta">{numOfGuests} Guests</Tag>
                </div>
                <Paragraph ellipsis={{ "rows": 3, "expandable": true }}>
                    {description}
                </Paragraph>
            </div>
        </div>
    );
};

export default ListingDetails;
