import * as dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (request, response) => {
  const { line_items } = request.body;
  const options = {
    mode: "payment",
    payment_method_types: ["card"], 
    line_items,
    success_url: `${process.env.BASE_URL}${process.env.CLIENT_PORT}/payment`,
    cancel_url: `${process.env.BASE_URL}${process.env.CLIENT_PORT}/payment/failed`
  };
  const session = await stripe.checkout.sessions.create(options);
  return response.status(200).json({ sessionUrl: session.url }).end();
};
