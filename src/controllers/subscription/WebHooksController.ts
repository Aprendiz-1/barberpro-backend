import { Request, Response } from 'express';
import Stripe from 'stripe';
import { saveSubscription } from '../../utils/manageSubscription';
import { stripe } from '../../utils/stripe';

class WebHooksController {
    async handle(req: Request, res: Response) {
        let event: Stripe.Event = req.body;
        const signature = req.headers['stripe-signature'];
        let endpointSecret = 'whsec_92f4e57fbce92b20492cce8329593434e2104b341b7a1e41336fc837ca4a3bcc';

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret,
            );
        } catch(error) {
            console.log(error.message);
            return res.sendStatus(400);
        }

        switch(event.type) {
            case 'customer.subscription.deleted':
                const payment = event.data.object as Stripe.Subscription;
                await saveSubscription(
                    payment.id,
                    payment.customer.toString(),
                    false,
                    true,
                );

                break;
            case 'customer.subscription.updated':
                const paymentIntent = event.data.object as Stripe.Subscription;
                await saveSubscription(
                    paymentIntent.id,
                    paymentIntent.customer.toString(),
                    false,
                );

                break;
            case 'checkout.session.completed':
                const checkoutSession = event.data.object as Stripe.Checkout.Session;
                await saveSubscription(
                    checkoutSession.subscription.toString(),
                    checkoutSession.customer.toString(),
                    true,
                );

                break;
            default:
                console.log(`Evento desconhecido: ${event.type}`)
        }

        res.send();
    }
}

export { WebHooksController };