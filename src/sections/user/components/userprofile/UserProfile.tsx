import React, { FC, Dispatch, SetStateAction } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Avatar, Card, Button, Divider, Typography, Tag } from "antd";
import { formatListingPrice } from "../../../../lib/utils/format";
import { displayErrorMessage, displaySuccessNotification } from "../../../../lib/utils/display";
import { User as UserData } from "../../../../lib/graphql/queries/user";
import { Viewer } from "../../../../lib/types";
import { 
    DISCONNECT_STRIPE, 
    DisconnectStripe as DisconnectStripeData 
} from "../../../../lib/graphql/mutations/disconnectstripe";

interface IProps {
    "user": UserData["user"];
    "setViewer": Dispatch<SetStateAction<Viewer>>;
    "isViewerUser": boolean;
    "handleUserRefetch": () => Promise<void>;
}

const stripeAuthUrl = `https://dashboard.stripe.com/oauth/v2/authorize?response_type=code&client_id=${process.env.REACT_APP_S_CLIENT_ID}&scope=read_write`;
const { Paragraph, Text, Title } = Typography;

const UserProfile: FC<IProps> = ({ user, isViewerUser, setViewer, handleUserRefetch }) => {
    const [disconnectStripe, { loading }] = useMutation<DisconnectStripeData>(
        DISCONNECT_STRIPE,
        {
            "onCompleted": data => {
                if (data && data.disconnectStripe) {
                    setViewer(prevState => ({ 
                        ...prevState, 
                        "hasWallet": data.disconnectStripe.hasWallet 
                    }));
                    displaySuccessNotification(
                        "You've successfully disconnected from Stripe!",
                        "You'll have to reconnect with Stripe to continue to create listings."
                    );
                    handleUserRefetch();
                }
            },
            "onError": () => {
                displayErrorMessage(
                    "Sorry! We weren't able to disconnect you from Stripe. Please try again later!"
                );
            },
        }
    );

    const redirectToStripe = () => {
        window.location.href = stripeAuthUrl;
    };

    const additionalDetails = user.hasWallet 
        ? (
            <>
                <Paragraph>
                    <Tag color="green">
                        Stripe Registered
                    </Tag>
                </Paragraph>
                <Paragraph>
                    Income Earned: {" "}
                    <Text strong>
                        {user.income ? formatListingPrice(user.income) : `$0`}
                    </Text>
                </Paragraph>
                <Button 
                    type="primary" 
                    className="user-profile__details-cta" 
                    loading={loading} 
                    onClick={() => disconnectStripe()}
                >
                    Disconnect Stripe
                </Button>
                <Paragraph type="secondary">
                    By disconnecting, you won't be able to receive{" "}
                    <Text strong>any further payments</Text>. This will prevent users from booking listings that
                    you might have already created.
                </Paragraph>
            </>
        )
        : (
        <>
            <Paragraph>
                Interested in becoming a ToHouse host? Register with your Stripe account!
            </Paragraph>
            <Button 
                type="primary" 
                className="user-profile__details-cta"
                onClick={redirectToStripe}
            >
                Connect with Stripe
            </Button>
            <Paragraph type="secondary">
                ToHouse uses {" "}
                <a 
                    href="https://stripe.com/en-US/connect"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Stripe
                </a>
                {" "} to help transfer your earnings in a secure and truster manner.
            </Paragraph>
        </>
    );
    
    const additionalDetailsSection = isViewerUser 
        ? (
            <>
                <Divider />
                <div className="user-profile__details">
                    <Title level={4}>
                        Additional Details
                    </Title>
                    {additionalDetails}
                </div>
            </>
        )
        : null;

    return (
        <div className="user-profile">
            <Card className="user-profile__card">
                <div className="user-profile__avatar">
                    <Avatar size={100} src={user.avatar} />
                </div>
                <Divider />
                <div className="user-profile__details">
                    <Title level={4}>Details</Title>
                    <Paragraph>
                        Name: <Text strong>{user.name}</Text>
                    </Paragraph>
                    <Paragraph>
                        Contact: <Text strong>{user.contact}</Text>
                    </Paragraph>
                </div>
                {additionalDetailsSection}
            </Card>
        </div>
    );
};

export default UserProfile;
