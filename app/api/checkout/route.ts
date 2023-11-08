import { prisma } from '@/app/utils/prisma'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import * as Yup from 'yup'
const jwt = require("jsonwebtoken")
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
    type DetailCart = {
        productId: string,
        price: number,
        qty: number
    }
    const stripeKey: string = process.env.STRIPE_SECRET_KEY!
    const stripe = new Stripe(stripeKey, {
        apiVersion: '2023-08-16',
    });
    const secrets = process.env.NEXTAUTH_SECRET
    const token = await getToken({ req, secret: secrets, raw: true })
    const checkoutSchema = Yup.object({
        stateId: Yup.string().required('required'),
        shippingMethodId: Yup.string().required('required'),
        discount: Yup.number().required('required'),
        deliveryCost: Yup.number().required('required'),
        total: Yup.number().required('required'),
        coupon: Yup.string(),
        details: Yup.array(
            Yup.object({
                productId: Yup.string().required(),
                price: Yup.number().required(),
                qty: Yup.number().required(),
                productName: Yup.string().required(),
                image: Yup.string().required(),
            })
        ),
        zipCode: Yup.string().required('required'),
        address: Yup.string().required('required'),
    })

    const data = await checkoutSchema.validate(await req.json())
    const user = jwt.verify(token, secrets)

    const coupon = data.coupon !== "" ? [{
        coupon: data.coupon,
    }] : []

    if (user) {
        const detail: DetailCart[] = []
        for (let item of data.details ?? []) {
            detail.push({ productId: item.productId, price: item.price, qty: item.qty })
        }
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                deliveryId: data.shippingMethodId,
                deliveryCost: data.deliveryCost,
                discount: data.discount,
                detailorder: {
                    create: detail
                },
                stateId: data.stateId,
                paid: false,
                fullName: user.name,
                total: data.total,
                zipCode: data.zipCode,
                address: data.address,
                couponCode: data.coupon
            }
        })

        const line_items = data.details?.map(item => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.productName,
                        images: [item.image]
                    },
                    unit_amount: item.price * 100
                }, quantity: item.qty
            }
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            discounts: coupon,
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: order.deliveryCost * 100,
                            currency: 'usd',
                        },
                        display_name: 'Delivery cost'
                    },
                }
            ],
            metadata: {
                order_id: order.id
            },
            success_url: `${process.env.NEXTAUTH_URL}/success?order=${order.id}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/cart`
        })

        return Response.json({ "url": session.url })
    } else {
        return new Response(JSON.stringify({ "error": "not authenticated" }), {
            status: 401,
        })
    }
}