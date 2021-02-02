import React, { FC, Dispatch, SetStateAction } from "react";
import moment, { Moment } from "moment";
import { Button, Card, Divider, Typography, DatePicker } from "antd";
import { formatListingPrice } from "../../../../lib/utils/format";
import { displayErrorMessage } from "../../../../lib/utils/display";

const { Paragraph, Title } = Typography;

interface IProps {
    "price": number;
    "checkInDate": Moment | null;
    "checkOutDate": Moment | null;
    "setCheckInDate": Dispatch<SetStateAction<Moment | null>>
    "setCheckOutDate": Dispatch<SetStateAction<Moment | null>>
}

const ListingCreateBooking: FC<IProps> = ({ 
    price, 
    checkInDate, 
    checkOutDate, 
    setCheckInDate, 
    setCheckOutDate 
}) => {
    const disabledDate = (currentDate?: Moment) => {
        if (currentDate) {
            const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf("day"));

            return dateIsBeforeEndOfDay;
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

        setCheckOutDate(selectedCheckOutDate);
    };

    const checkOutInputDisabled = !checkInDate;
    const buttonDisabled = !checkInDate || !checkOutDate;
    
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
                >
                    Request to book!
                </Button>
            </Card>
        </div>
    );
};

export default ListingCreateBooking;
