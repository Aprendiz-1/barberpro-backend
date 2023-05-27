import prismaClient from "../../prisma";
import Stripe from "stripe";

interface SubscriptionRequest {
    user_id: string;
}

class SubscriptionService {
    async execute({user_id}: SubscriptionRequest) {
        const stripe = new Stripe(
            process.env.STRIPE_API_KEY,
            {
                apiVersion: '2022-11-15',
                appInfo: {
                    name: 'BarberPRO',
                    version: '1',
                }
            }
        );

        const user = await prismaClient.user.findFirst({
            where: {
                id: user_id,
            }
        });

        let customerId = user.stripe_customer_id;

        if(!customerId) {
            const stripeCustomer = await stripe.customers.create({
                email: user.email,
            });

            await prismaClient.user.update({
                where: {
                    id: user_id,
                },
                data: {
                    stripe_customer_id: stripeCustomer.id,
                }
            });

            customerId = stripeCustomer.id;
        }

        const stripeCheckout = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                {price: process.env.STRIPE_PRICE, quantity: 1}
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
        });

        return { sessionId: stripeCheckout.id };
    }
}

export { SubscriptionService };