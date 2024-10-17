const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      firstName, lastName, email, phone, address, address2, city, postalCode,
      phoneBrand, phoneModel, imageUrl, customText, quantity
    } = req.body;

    try {
      // Affiche les métadonnées dans la console du serveur avant de créer la session
      console.log('Métadonnées envoyées à Stripe:', {
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
        customText: customText || '', // Champ optionnel
        imageUrl
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Coque personnalisée (${phoneBrand} ${phoneModel})`,
                images: [imageUrl], // Lien de l'image Cloudinary
              },
              unit_amount: 0, // Ajuste le prix unitaire (en centimes)
            },
            quantity: parseInt(quantity), // Quantité
          },
        ],
        mode: 'payment',
        customer_email: email,
        metadata: {
          firstName,
          lastName,
          phone,
          address,
          address2,
          city,
          postalCode,
          phoneBrand,
          phoneModel,
          customText: customText || '', // Champ optionnel
          imageUrl
        },
        success_url: `${req.headers.origin}/success.html`,
        cancel_url: `${req.headers.origin}/cancel.html`,
      });

      res.status(200).json({ id: session.id });
    } catch (err) {
      console.error('Erreur lors de la création de la session Stripe:', err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}
