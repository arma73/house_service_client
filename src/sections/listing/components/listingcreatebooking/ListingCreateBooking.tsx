import React, { FC, Dispatch, SetStateAction } from "react";
import moment, { Moment } from "moment";
import { Button, Card, Divider, Typography, DatePicker } from "antd";
import { formatListingPrice } from "../../../../lib/utils/format";
import { displayErrorMessage } from "../../../../lib/utils/display";
import { Viewer } from "../../../../lib/types";
import { Listing as ListingData } from "../../../../lib/graphql/queries/listing";
import { BookingsIndex } from "./types";

const { Paragraph, Title, Text } = Typography;

interface IProps {
    "viewer": Viewer;
    "price": number;
    "bookingsIndex": ListingData["listing"]["bookingsIndex"];
    "host": ListingData["listing"]["host"];
    "checkInDate": Moment | null;
    "checkOutDate": Moment | null;
    "setCheckInDate": Dispatch<SetStateAction<Moment | null>>;
    "setCheckOutDate": Dispatch<SetStateAction<Moment | null>>;
    "setModalVisible": Dispatch<SetStateAction<boolean>>
}

const ListingCreateBooking: FC<IProps> = ({ 
    viewer,
    price,
    bookingsIndex,
    host,
    checkInDate,
    checkOutDate,
    setCheckInDate,
    setCheckOutDate,
    setModalVisible
}) => {
    const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);

    const dateIsBooked = (currentDate: Moment) => {
        const year = moment(currentDate).year();
        const month = moment(currentDate).month();
        const day = moment(currentDate).day();

        if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month]) {
            return Boolean(bookingsIndexJSON[year][month][day]);
        } else {
            return false;
        }
    };

    const disabledDate = (currentDate?: Moment) => {
        if (currentDate) {
            const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf("day"));

            return dateIsBeforeEndOfDay || dateIsBooked(currentDate);
        } else {
            return false;
        }
    };

    const verifyAndSetCheckOutDate = (selectedCheckOutDate: Moment | null) => {
        if (checkInDate && selectedCheckOutDate) {
            if (moment(selectedCheckOutDate).isBefore(checkInDate, "days")) {
                return displayErrorMessage(
                    `You can't book date of check out to be prior to check in!`
                );
            }
        }

        let dateCursor = checkInDate;
        
        while (moment(dateCursor).isBefore(selectedCheckOutDate, "days")) {
            dateCursor = moment(dateCursor).add(1, "days");

            const year = moment(dateCursor).year();
            const month = moment(dateCursor).month();
            const day = moment(dateCursor).day();

            if (
                bookingsIndexJSON[year] && 
                bookingsIndexJSON[year][month] && 
                bookingsIndexJSON[year][month][day]
            ) {
                return displayErrorMessage(
                    "You can't book a period of time that overlaps existing bookings. Please try again!"
                );
            }
        }

        setCheckOutDate(selectedCheckOutDate);
    };

    const viewerIsHost = viewer.id === host.id;
    const checkInInputDisabled = !viewer.id || viewerIsHost || !host.hasWallet;
    const checkOutInputDisabled = checkInInputDisabled || !checkInDate;
    const buttonDisabled = checkOutInputDisabled || !checkInDate || !checkOutDate;

    let buttonMessage = viewer.id 
        ? viewerIsHost 
            ? "You can't book your own listing!"  
            : host.hasWallet 
                ? "You won't be charged yet"
                : "The host has disconnected from Stripe and thus won't be able to receive payments!"
        : "You have to be signed in to book a listing!";

    return (
        <div className="listing-booking">
            <Card className="listing-booking__card">
                <div>
                    <Paragraph>
                        <Title level={2} className="listing-booking__card-title">
                            {formatListingPrice(price)}
                            <span>/day</span>
                        </Title>
                    </Paragraph>
                    <Divider />
                    <div className="listing-booking__card-date-picker">
                        <Paragraph strong> Check In </Paragraph>
                        <DatePicker 
                            value={checkInDate ? checkInDate : undefined}
                            format={"YYYY/MM/DD"}
                            showToday={false}
                            disabled={checkInInputDisabled}
                            disabledDate={disabledDate}
                            onChange={setCheckInDate}
                            onOpenChange={() => setCheckOutDate(null)}
                        />
                    </div>
                    <div className="listing-booking__card-date-picker">
                        <Paragraph strong> Check Out </Paragraph>
                        <DatePicker
                            value={checkOutDate ? checkOutDate : undefined}
                            format={"YYYY/MM/DD"}
                            showToday={false}
                            disabled={checkOutInputDisabled}
                            disabledDate={disabledDate}
                            onChange={verifyAndSetCheckOutDate}
                        />
                    </div>
                </div>
                <Divider />
                <Button 
                    size="large" 
                    type="primary" 
                    className="listing-booking__card-cta"
                    disabled={buttonDisabled}
                    onClick={() => setModalVisible(true)}
                >
                    Request to book!
                </Button>
                <Text type="secondary" mark>{buttonMessage}</Text>
            </Card>
        </div>
    );
};

export default ListingCreateBooking;
