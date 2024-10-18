import { buffer } from 'micro';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false, // Désactiver le parsing du corps par défaut
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Lire le corps de la requête en tant que buffer brut
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      // Construire l'événement Stripe à partir du corps brut et de la signature
      event = stripe.webhooks.constructEvent(buf.toString(), sig, endpointSecret);
    } catch (err) {
      console.error('Erreur lors de la vérification de la signature Webhook:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Vérifier si l'événement est 'checkout.session.completed'
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata;

      console.log('Données reçues du Webhook:', metadata);

      // URL du script Google Apps
      const googleAppsScriptUrl = `https://script.google.com/macros/s/${process.env.YOUR_SCRIPT_ID}/exec`;

      try {
        // Envoyer les métadonnées au Google Apps Script
        const response = await fetch(googleAppsScriptUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metadata), // Envoi des métadonnées
        });

        const result = await response.json();
        console.log('Réponse du Google Apps Script:', result);
      } catch (err) {
        console.error('Erreur lors de l\'envoi des données vers Google Apps Script:', err);
      }
    }

    // Retourner une réponse 200 pour indiquer que le Webhook a été reçu
    res.status(200).json({ received: true });
  } else {
    // Si ce n'est pas une méthode POST, retourner une erreur 405
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}
