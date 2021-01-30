import { ObjectId } from "mongodb";
import { User } from "../lib/types";

export const users: User[] = [
    {
        "_id": new ObjectId("5d378db94e84753160e08b55"),
        "token": "token_************",
        "name": "James J.",
        "avatar":
            "https://picsum.photos/800/600",
        "contact": "james@gmail.com",
        "walletId": "acct_************",
        "income": 723796,
        "bookings": [],
        "listings": [
            new ObjectId("5d378db94e84753160e08b31"),
            new ObjectId("5d378db94e84753160e08b4b"),
            new ObjectId("5d378db94e84753160e08b4c"),
        ],
    },
    {
        "_id": new ObjectId("5d378db94e84753160e08b56"),
        "token": "token_************",
        "name": "Elizabeth A.",
        "avatar":
            "https://picsum.photos/800/600",
        "contact": "elizabeth@gmail.com",
        "walletId": "acct_************",
        "income": 256144,
        "bookings": [],
        "listings": [
            new ObjectId("5d378db94e84753160e08b37"),
            new ObjectId("5d378db94e84753160e08b38"),
            new ObjectId("5d378db94e84753160e08b3a"),
            new ObjectId("5d378db94e84753160e08b3b"),
            new ObjectId("5d378db94e84753160e08b3d"),
            new ObjectId("5d378db94e84753160e08b41"),
            new ObjectId("5d378db94e84753160e08b43"),
            new ObjectId("5d378db94e84753160e08b4a"),
            new ObjectId("5d378db94e84753160e08b50"),
            new ObjectId("5d378db94e84753160e08b51"),
            new ObjectId("5d378db94e84753160e08b53"),
            new ObjectId("5d378db94e84753160e08b54"),
        ],
    },
    {
        "_id": new ObjectId("5d378db94e84753160e08b57"),
        "token": "token_************",
        "name": "Andrew D.",
        "avatar":
            "https://picsum.photos/800/600",
        "contact": "andrew@gmail.com",
        "walletId": "acct_************",
        "income": 272359,
        "bookings": [],
        "listings": [
            new ObjectId("5d378db94e84753160e08b30"),
            new ObjectId("5d378db94e84753160e08b32"),
            new ObjectId("5d378db94e84753160e08b34"),
            new ObjectId("5d378db94e84753160e08b35"),
            new ObjectId("5d378db94e84753160e08b36"),
            new ObjectId("5d378db94e84753160e08b3c"),
            new ObjectId("5d378db94e84753160e08b3e"),
            new ObjectId("5d378db94e84753160e08b47"),
            new ObjectId("5d378db94e84753160e08b48"),
            new ObjectId("5d378db94e84753160e08b4d"),
        ],
    },
    {
        "_id": new ObjectId("5d378db94e84753160e08b58"),
        "token": "token_************",
        "name": "Danielle C.",
        "avatar":
            "https://picsum.photos/800/600",
        "contact": "danielle@gmail.com",
        "walletId": "acct_************",
        "income": 465043,
        "bookings": [],
        "listings": [
            new ObjectId("5d378db94e84753160e08b3f"),
            new ObjectId("5d378db94e84753160e08b40"),
            new ObjectId("5d378db94e84753160e08b44"),
        ],
    },
    {
        "_id": new ObjectId("5d378db94e84753160e08b59"),
        "token": "token_************",
        "name": "Sarah K.",
        "avatar":
            "https://picsum.photos/800/600",
        "contact": "sarah@gmail.com",
        "walletId": "acct_************",
        "income": 104347,
        "bookings": [],
        "listings": [
            new ObjectId("5d378db94e84753160e08b33"),
            new ObjectId("5d378db94e84753160e08b39"),
            new ObjectId("5d378db94e84753160e08b42"),
            new ObjectId("5d378db94e84753160e08b45"),
            new ObjectId("5d378db94e84753160e08b46"),
            new ObjectId("5d378db94e84753160e08b49"),
            new ObjectId("5d378db94e84753160e08b4e"),
            new ObjectId("5d378db94e84753160e08b4f"),
            new ObjectId("5d378db94e84753160e08b52"),
        ],
    },
];