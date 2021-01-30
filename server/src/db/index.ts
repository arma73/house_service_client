import { MongoClient } from "mongodb";
import { Database, Listing, User, Booking } from "../lib/types";

const { DB_USER, DB_PASSWORD, DB_NAME, DB_CLUSTER } = process.env;

const url =
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

export const connectDatabase = async (): Promise<Database> => {
    const client = await MongoClient.connect(url, { 
        "useNewUrlParser": true,
        "useUnifiedTopology": true,
    });

    const db = client.db(DB_NAME);

    return {
        "bookings": db.collection<Booking>("bookings"),
        "listings": db.collection<Listing>("listings"),
        "users": db.collection<User>("users"),
    };
};
