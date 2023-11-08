import { prisma } from "@/app/utils/prisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { Readable } from "stream";
import Stripe from 'stripe'


export async function POST(req: Request) {
  const endpointKey = process.env.WEBHOOK_KEY
  const stripeKey: string = process.env.STRIPE_SECRET_KEY!
  const stripe = new Stripe(stripeKey, {
    apiVersion: '2023-08-16',
  });
  const sig = req.headers.get('stripe-signature') ?? "";

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, endpointKey);
  } catch (err) {
    // On error, log and return the error message
    console.log(`❌ Error message: ${err}`);

    return new Response(JSON.stringify({ "error": `Webhook Error: ${err}` }), {
      status: 400,
    })
  }

  // Cast event data to Stripe object
  if (event.type === 'checkout.session.completed') {
    const payment = event.data?.object?.payment_status
    const idOrder = event.data?.object?.metadata?.order_id
    if (payment === "paid" && idOrder) {
      await prisma.order.update({
        where: {
          id: idOrder,
        },
        data: {
          paid: true,
          statusId: "done"
        },
      })

      await sendPaymentReceivedNotification(idOrder)
    }
  } else if (event.type === "charge.succeeded") {
    const orderId = event?.data?.object?.metadata?.order_id
    const paid = event?.data?.object?.paid
    if (orderId && paid === true) {
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          paid: true,
          statusId: "done"
        },
      })
      await sendPaymentReceivedNotification(orderId)
    }
  }
  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true })
}

async function sendPaymentReceivedNotification(orderId: string) {
  await fetch(`${process.env.NEXTAUTH_URL}/api/notification?orderId=${orderId}`).then(res => { if (res.ok) { res.json() } }).catch(err => console.log(err))
}