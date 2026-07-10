import { getStripe } from '../utils/stripe.js';

export async function createPaymentIntent(req, res) {
  const { totalAmount } = req.body;

  if (typeof totalAmount !== 'number' || !Number.isFinite(totalAmount) || totalAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'totalAmount must be a positive number'
    });
  }

  const amount = Math.round(totalAmount * 100);

  if (amount < 1) {
    return res.status(400).json({
      success: false,
      message: 'totalAmount is too small'
    });
  }

  try {
    const paymentIntent = await getStripe().paymentIntents.create({
      amount,
      currency: (process.env.STRIPE_CURRENCY || 'bdt').toLowerCase(),
      payment_method_types: ['card']
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Create payment intent failed:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to create payment intent'
    });
  }
}
