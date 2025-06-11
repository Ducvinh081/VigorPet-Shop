import {Order} from "@/models/Order";
import connectDB from "@/libs/mongoConnect"
const stripe = require('stripe')(process.env.STRIPE_SK);

export async function POST(req) {
  await connectDB();
  const sig = req.headers.get('stripe-signature');
  let event;

  try {
    const reqBuffer = await req.text();
    const signSecret = process.env.STRIPE_SIGN_SECRET;
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signSecret);
  } catch (e) {
    console.error('stripe error');
    console.log(e);
    return Response.json(e, {status: 400});
  }

 // Xử lý các sự kiện từ Stripe
 if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  const orderId = session.metadata?.orderId;
  
  if (orderId) {
    // Cập nhật trạng thái paid thành true
    await Order.findByIdAndUpdate(orderId, { paid: true });
    console.log(`Order ${orderId} marked as paid`);
  }
}

if (event.type === 'payment_intent.succeeded') {
  const paymentIntent = event.data.object;
  const orderId = paymentIntent.metadata?.orderId;
  
  if (orderId) {
    // Backup: cập nhật trạng thái paid thành true
    await Order.findByIdAndUpdate(orderId, { paid: true });
    console.log(`Order ${orderId} marked as paid via payment_intent`);
  }
}

  return Response.json('OK', {status: 200});
}