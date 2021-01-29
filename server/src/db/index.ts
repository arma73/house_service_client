import dotenv from "dotenv";
import { Database, Listing } from "../lib/types";
import { MongoClient } from "mongodb";

dotenv.config();

const user = process.env.DB_USER;
const userPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const cluster = process.env.DB_CLUSTER;

const url =
    `mongodb+srv://${user}:${userPassword}@${cluster}.mongodb.net/${dbName}?retryWrites=true&w=majority`;

export const connectDatabase = async (): Promise<Database> => {
    const client = await MongoClient.connect(url, { 
        "useNewUrlParser": true,
        "useUnifiedTopology": true,
    });

    const db = client.db(dbName);

    return {
        "listings": db.collection<Listing>("test_listings"),
    };
};
