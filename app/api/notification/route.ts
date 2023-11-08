import { fcm } from "@/app/utils/firebase/fcm";
import { prisma } from "@/app/utils/prisma";

export async function GET(req: Request) {
    const url = new URL(req.url)
    const { searchParams } = url
    if (searchParams.get("orderId")) {
        const order = await prisma.order.findUnique({
            where: {
                id: searchParams.get("orderId") as string
            }, include: {
                user: {
                    select: {
                        fcmToken: true
                    }
                }
            }
        })
        if (order?.user.fcmToken) {
            try {
                const message = {
                    notification: {
                        title: 'Payment received',
                        body: 'Thanks for choosing us!',
                    },
                    token: order?.user.fcmToken as string,
                };

                const response = await fcm.send(message);
                console.log('Message sent successfully:', response);

                return Response.json({ success: true });
            } catch (error) {
                console.error('Error sending message:', error);
                return Response.json({ success: false, error: error });
            }
        }
    }
};