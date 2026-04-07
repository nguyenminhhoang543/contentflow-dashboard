import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
       return NextResponse.json(
          { error: "Stripe Secret Key is missing from .env.local" },
          { status: 400 }
       );
    }

    // Initialize Stripe securely on the server inside the request.
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-12-18.acacia",
    });

    // Create Stripe Checkout Session
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email || undefined,
      metadata: {
        userId: userId,
      },
      line_items: [
        {
          price_data: {
             currency: "usd",
             product_data: {
               name: "ContentFlow Pro Tier",
               description: "Monthly subscription for premium content generation dashboard."
             },
             unit_amount: 29900, // $299.00
             recurring: {
               interval: "month"
             }
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/billing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
