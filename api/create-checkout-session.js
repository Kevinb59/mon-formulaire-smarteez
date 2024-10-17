const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Utilisation de la clé secrète Stripe

export default async function handler(req, res) {
  // Autorise uniquement les requêtes POST
  if (req.method === 'POST') {
    try {
      // Créer la session de paiement
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur', // Devise
              product_data: {
                name: 'Produit Test', // Nom du produit
              },
              unit_amount: 1000, // Prix en centimes (ici 10€)
            },
            quantity: 1, // Quantité (tu pourras le rendre dynamique plus tard)
          },
        ],
        mode: 'payment', // Mode de paiement unique
        success_url: `${req.headers.origin}/success.html`, // Redirection en cas de succès
        cancel_url: `${req.headers.origin}/cancel.html`, // Redirection en cas d'annulation
      });

      // Renvoie l'ID de la session au client
      res.status(200).json({ id: session.id });
    } catch (err) {
      // Gestion des erreurs
      res.status(500).json({ error: err.message });
    }
  } else {
    // Si la méthode n'est pas POST, renvoie une erreur 405
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}
