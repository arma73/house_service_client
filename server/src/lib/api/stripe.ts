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
    "charge": async (amount: number, source: string, stripeAccount: string) => {
        const res = await client.charges.create({
            "currency": "usd",
            "application_fee_amount": (amount * 0.05),
            amount,
            source,
        }, {
            stripeAccount
        });

        if (res.status !== "succeeded") {
            throw new Error("failed to create charge with Stripe");
        }
    }
};
