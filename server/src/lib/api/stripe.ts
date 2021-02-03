import Stripe from "stripe";

const client = new Stripe(`${process.env.S_SECRET_KEY}`, {
    "apiVersion": "2020-08-27",
});

export const stripeApi = {
    "connect": async (code: string) => {
        const response = await client.oauth.token({
            "grant_type": "authorization_code",
            code,
        });

        return response;
    },
};
