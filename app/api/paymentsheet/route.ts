import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import Stripe from 'stripe'
const jwt = require("jsonwebtoken")

export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const { searchParams } = url
    const orderId = searchParams.get("orderId") ?? ""
    const stripeKey: string = process.env.STRIPE_SECRET_KEY as string
    const stripe = new Stripe(stripeKey, {
        apiVersion: '2023-08-16',
    });

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)

    if (user) {
        const customer = await stripe.customers.create();
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2023-10-16' }
        );
        const paymentIntent = await stripe.paymentIntents.create({
            amount: (Number(searchParams.get("total")) ?? 0) * 100,
            currency: 'usd',
            customer: customer.id,
            metadata: {order_id: orderId},
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return Response.json({
            data: {
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id,
                publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
            }
        });
    }
}