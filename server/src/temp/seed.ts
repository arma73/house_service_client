require("dotenv").config();

import { connectDatabase } from "../db";
import { listings, users } from "../mocks";

const seed = async () => {
    try {
        console.log("[seed] : running...");

        const db = await connectDatabase();

        for (const listing of listings) {
            await db.listings.insertOne(listing);
        }

        for (const user of users) {
            await db.users.insertOne(user);
        }

        console.log("[seed] : success...");
        process.exit(0);
    } catch {
        throw new Error("failed to seed database");
    }
};

seed();
