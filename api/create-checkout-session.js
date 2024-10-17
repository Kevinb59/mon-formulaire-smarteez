const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur', // Remplace 'eur' par la devise que tu souhaites utiliser
              product_data: {
                name: 'Nom du produit', // Remplace par le nom de ton produit
              },
              unit_amount: 1000, // Le prix en centimes (1000 = 10 euros)
            },
            quantity: 1, // Tu peux récupérer la quantité depuis ton formulaire si nécessaire
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success.html`, // Redirige vers cette URL après un paiement réussi
        cancel_url: `${req.headers.origin}/cancel.html`, // Redirige ici si le client annule le paiement
      });

      res.status(200).json({ id: session.id }); // Renvoie l'ID de la session au frontend
    } catch (err) {
      console.error('Erreur lors de la création de la session Stripe:', err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}
