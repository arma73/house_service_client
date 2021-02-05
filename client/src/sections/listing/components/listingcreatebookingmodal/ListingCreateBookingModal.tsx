import React, { FC, Dispatch, SetStateAction } from "react";
import { Modal, Button, Divider, Typography } from "antd";
import { useMutation } from "@apollo/react-hooks";
import { CardElement, injectStripe, ReactStripeElements } from "react-stripe-elements";
import { KeyOutlined } from "@ant-design/icons";
import moment, { Moment } from "moment";
import { formatListingPrice } from "../../../../lib/utils/format";
import { displayErrorMessage, displaySuccessNotification } from "../../../../lib/utils/display";
import { 
    CREATE_BOOKING, 
    CreateBooking as CreateBookingData, 
    CreateBookingVariables 
} from "../../../../lib/graphql/mutations/createbooking";

interface IProps {
    "id": string;
    "price": number;
    "modalVisible": boolean;
    "checkInData": Moment;
    "checkOutData": Moment;
    "setModalVisible": Dispatch<SetStateAction<boolean>>;
    "clearBookingDate": () => void ;
    "handleListingRefetch": () => Promise<void> ; 
}

const { Paragraph, Text, Title } = Typography;

const ListingCreateBookingModal: FC<IProps & ReactStripeElements.InjectedStripeProps> = ({ 
    id,
    modalVisible,
    setModalVisible,
    clearBookingDate,
    handleListingRefetch,
    checkInData,
    checkOutData,
    price,
    stripe
}) => {
    const [createBooking, { loading }] = useMutation<
        CreateBookingData, 
        CreateBookingVariables
    >(CREATE_BOOKING, {
        "onCompleted": () => {
            clearBookingDate();
            displaySuccessNotification(
                "You've successfully booked the listing!",
                "Booking history can always be found in your User page"
            );
            handleListingRefetch();
        },
        "onError": () => {
            displayErrorMessage(
                "Sorry! We weren't able to successfully book the listing. Please try again later"
            );
        },
    });
    const daysBooked = checkOutData.diff(checkInData, "days") + 1;
    const listingPrice = price * daysBooked;
    // const toHouseFee = 0.05 * listingPrice;
    // const totalPrice = listingPrice + toHouseFee;

    const handleCreateBooking = async () => {
        if (!stripe) {
            return displayErrorMessage("Sorry! We weren't able to connect with Stripe.");
        }

        let { token: stripeToken, error } = await stripe.createToken();
        if (stripeToken) {
            createBooking({
                "variables": {
                    "input": {
                        id,
                        "source": stripeToken.id,
                        "checkIn": moment(checkInData).format("YYYY-MM-DD"),
                        "checkOut": moment(checkOutData).format("YYYY-MM-DD"),
                    },
                },
            });
        } else {
            displayErrorMessage(
                error && error.message 
                    ? error.message 
                    : "Sorry! We weren't able to book the listing. Please try again later."
            );
        }
    };

    return (
        <Modal
            visible={modalVisible}
            centered
            footer={null}
            onCancel={() => setModalVisible(false)}
        >
            <div className="listing-booking-modal">
                <div className="listing-booking-modal__intro">
                    <Title className="listing-booking-modal__intro-title">
                        <KeyOutlined />
                    </Title>
                    <Title level={3} className="listing-booking-modal__intro-title">
                        Book your trip
                    </Title>
                    <Paragraph>
                        Enter your payment information to book the listing from the dates between 
                        <Text mark strong>
                            {moment(checkInData).format("MMMM Do YYYY")}
                        </Text> {" "}
                        and{" "}
                        <Text mark strong>
                            {moment(checkOutData).format("MMMM Do YYYY")}
                        </Text>, inclusive.
                    </Paragraph>
                </div>
                <Divider />
                <div className="listing-booking-modal__charge-summary">
                    <Paragraph>
                        {formatListingPrice(price, false)} * {daysBooked} days = {" "}
                        <Text strong>{formatListingPrice(listingPrice, false)}</Text>
                    </Paragraph>
                    {/* <Paragraph>
                        ToHouse Fee <sub>~ 5%</sub> = <Text strong>{formatListingPrice(toHouseFee, false)}</Text>
                    </Paragraph> */}
                    <Paragraph className="listing-booking-modal__charge-summary-total">
                        Total = <Text mark>{formatListingPrice(listingPrice, false)}</Text>
                    </Paragraph>
                </div>
                <Divider />
                <div className="listing-booking-modal__stripe-card-section">
                    <CardElement 
                        hidePostalCode
                        className="listing-booking-modal__stripe-card"
                    />
                    <Button 
                        size="large" 
                        type="primary" 
                        loading={loading}
                        className="listing-booking-modal__cta"
                        onClick={handleCreateBooking}
                    >
                        Book
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default injectStripe(ListingCreateBookingModal);
