export const formatListingPrice = (price: number, round = true) => {
    const formattedListingPrice = round
        ? Math.round(price / 100)
        : price / 100;
    
    return `${formattedListingPrice}$`;
};