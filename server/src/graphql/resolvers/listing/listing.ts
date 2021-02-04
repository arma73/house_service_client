import { IResolvers } from "apollo-server-express";
import { Request } from "express";
import { ObjectId } from "mongodb";
import { Listing, Database, User, ListingType } from "../../../lib/types";
import { googleApi } from "../../../lib/api/google";
import { cloudinaryApi } from "../../../lib/api/cloudinary";
import { authorize } from "../../../lib/utils/authorize";
import { 
    ListingArgs, 
    ListingBookingsArgs, 
    ListingBookingsData, 
    ListingsArgs, 
    ListingsData, 
    ListingsFilter,
    ListingsQuery,
    HostListingInput,
    HostListingArgs
} from "./types";

const verifyHostListingInput = ({ title, description, type, price }: HostListingInput) => {
    if (title.length > 100) {
        throw new Error("listing title must be under 100 characters");
    }
    if (description.length > 5000) {
        throw new Error("listing description must be under 5000 characters");
    }
    if (type !== ListingType.Apartment && type !== ListingType.House) {
        throw new Error("listing type must be either an apartment or house");
    }
    if (price < 0) {
        throw new Error("price must be greater than 0");
    }
};

export const listingResolvers: IResolvers = {
    "Query": {
        "listing": async (
            _root: undefined, 
            { id }: ListingArgs, 
            { db, req }: { db: Database, req: Request }
        ): Promise<Listing> => {
            try {
                const listing = await db.listings.findOne({ "_id": new ObjectId(id) });
                if (!listing) {
                    throw new Error("listing can't be found");
                }

                const viewer = await authorize(db, req);
                if (viewer && viewer._id === listing.host) {
                    listing.authorized = true;
                }

                return listing;
            } catch (error) {
                throw new Error(`Failed to query listing: ${error}`);
            }
        },
        "listings": async (
            _root: undefined, 
            { location, filter, limit, page }: ListingsArgs, 
            { db }: { db: Database }
        ): Promise<ListingsData> => {
            try {
                const query: ListingsQuery = {};
                const data: ListingsData = {
                    "region": null,
                    "total": 0,
                    "result": [],
                };

                if (location) {
                    const { country, admin, city } = await googleApi.geocode(location);

                    if (city) query.city = city;
                    if (admin) query.admin = admin;
                    if (country) {
                        query.country = country;
                    } else {
                        throw new Error("no country found");
                    }

                    const cityText = city ? `${city}, ` : ""; 
                    const adminText = admin ? `${admin}, ` : "";
                    data.region = `${cityText}${adminText}${country}`;
                }

                let cursor = await db.listings.find(query);

                if (filter && filter === ListingsFilter.PRICE_LOW_TO_HIGH) {
                    cursor = cursor.sort({ "price": 1 });
                }

                if (filter && filter === ListingsFilter.PRICE_HIGH_TO_LOW) {
                    cursor = cursor.sort({ "price": -1 });
                }

                // page = 1; limit = 10; cursor starts at 0
                // page = 2; limit = 10; cursor starts at 10;
                cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);

                data.total = await cursor.count();
                data.result = await cursor.toArray();

                return data;
            } catch (error) {
                throw new Error(`Failed to query listings: ${error}`);
            }
        },
    },
    "Mutation": {
        "hostListing": async (
            _root: undefined,
            { input }: HostListingArgs,
            { db, req }: { db: Database, req: Request }
        ): Promise<Listing> => {
            verifyHostListingInput(input);

            let viewer = await authorize(db, req);
            if (!viewer) {
                throw new Error("viewer cannot be found");
            }

            const { country, admin, city } = await googleApi.geocode(input.address);
            if (!country || !admin || !city) {
                throw new Error("invalid address input");
            }

            const imageUrl = await cloudinaryApi.upload(input.image);

            const insertResult = await db.listings.insertOne({
                "_id": new ObjectId(),
                ...input,
                "image": imageUrl,
                "bookings": [],
                "bookingsIndex": {},
                "host": viewer._id,
                country,
                admin,
                city,
            });

            const insertedListing: Listing = insertResult.ops[0];
            await db.users.updateOne(
                { "_id": viewer._id },
                { "$push": { "listings": insertedListing._id } }
            );

            return insertedListing;
        },
    },
    "Listing": {
        "id": (listing: Listing): string => {
            return listing._id.toString();
        },
        "host": async (
            listing: Listing,
            _args: {},
            { db }: { db: Database }
        ): Promise<User> => {
            const host = await db.users.findOne({ "_id": listing.host });

            if (!host) {
                throw new Error("host can't be found");
            }

            return host;
        },
        "bookingsIndex": (listing: Listing): string => {
            return JSON.stringify(listing.bookingsIndex);
        },
        "bookings": async (
            listing: Listing, 
            { limit, page }: ListingBookingsArgs, 
            { db }: { db: Database }
        ): Promise<ListingBookingsData | null> => {
            try {
                if (!listing.authorized) {
                    return null;
                }

                const data: ListingBookingsData = {
                    "total": 0,
                    "result": [],
                };

                let cursor = await db.bookings.find({
                    "_id": { "$in": listing.bookings },
                });

                // page = 1; limit = 10; cursor starts at 0
                // page = 2; limit = 10; cursor starts at 10;
                cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);

                data.total = await cursor.count();
                data.result = await cursor.toArray();

                return data;
            } catch (error) {
                throw new Error(`Failed to query listing bookings: ${error}`);
            }
        },
    },
};
