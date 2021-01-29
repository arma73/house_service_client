interface Listing {
    "id": string,
    "title": string,
    "image": string,
    "address": string,
    "price": number,
    "numOfGuests": number,
    "numOfBeds": number,
    "numOfBaths": number,
    "rating": number
};

export const listings: Listing[] = [
    {
        "id": "001",
        "title": "Clean and fully furnished apartment. 5 min away from CN Tower",
        "image":
            "https://unsplash.com/photos/7LG4q-PP8ZQ",
        "address": "3210 Scotchmere Dr W, Toronto, ON, CA",
        "price": 10000,
        "numOfGuests": 2,
        "numOfBeds": 1,
        "numOfBaths": 2,
        "rating": 5,
    },
    {
        "id": "002",
        "title": "Luxurious home with private pool",
        "image":
            "https://unsplash.com/photos/_TPTXZd9mOo",
        "address": "100 Hollywood Hills Dr, Los Angeles, California",
        "price": 15000,
        "numOfGuests": 2,
        "numOfBeds": 1,
        "numOfBaths": 1,
        "rating": 4,
    },
    {
        "id": "003",
        "title": "Single bedroom located in the heart of downtown San Fransisco",
        "image":
            "https://unsplash.com/photos/wD3dur3v9aE",
        "address": "200 Sunnyside Rd, San Fransisco, California",
        "price": 25000,
        "numOfGuests": 3,
        "numOfBeds": 2,
        "numOfBaths": 2,
        "rating": 3,
    },
];
