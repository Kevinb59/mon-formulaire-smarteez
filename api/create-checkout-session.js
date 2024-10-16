const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { 
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
    quantity 
  } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Coque personnalisée',
              images: [imageUrl], // Lien de l'image uploadée sur Cloudinary
            },
            unit_amount: 1999, // Prix en centimes (exemple 19,99€)
          },
          quantity: quantity || 1, // Quantité sélectionnée par l'utilisateur
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
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
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
