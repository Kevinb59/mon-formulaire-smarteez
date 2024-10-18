const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, phone, address, address2, city, postalCode, phoneBrand, phoneModel, customText, imageUrl, quantity } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Coque personnalisée - ${phoneBrand} ${phoneModel}`,
                images: [imageUrl],
              },
              unit_amount: 2490,
            },
            quantity: quantity,
          },
        ],
        mode: 'payment',
        success_url: 'https://www.smart-z.fr/success',
        cancel_url: 'https://www.smart-z.fr/cancel',
        metadata: {
          firstName,
          lastName,
          email,
          phone,
          address,
          address2,
          city,
          postalCode,
          phoneBrand,
          phoneModel,
          customText,
          imageUrl,
          quantity,
        },
      });

      res.status(200).json({ id: session.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
