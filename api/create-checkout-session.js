// create-checkout-session.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Clé secrète Stripe

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Créer une session de paiement
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Produit Test', // Nom du produit (remplaçable plus tard)
              },
              unit_amount: 1000, // Prix en centimes (10€ ici)
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success.html`,
        cancel_url: `${req.headers.origin}/cancel.html`,
      });

      // Réponse contenant l'ID de la session
      res.status(200).json({ id: session.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}
