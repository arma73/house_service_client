import { Collection, ObjectId } from "mongodb";

export interface Booking {
    "_id": ObjectId;
}

export interface Listing {
    "_id": ObjectId;
}

export interface User {
    "_id": ObjectId;
    "token": string;
    "name": string;
    "avatar": string;
    "contact": string;
    "walletId"?: string;
    "income": number;
    "bookings": ObjectId[];
    "listings": ObjectId[];
}

export interface Database {
    "bookings": Collection<Booking>;
    "listings": Collection<Listing>;
    "users": Collection<User>;
}
