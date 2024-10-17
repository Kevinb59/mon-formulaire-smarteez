const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Clé secrète du Webhook

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Erreur lors de la vérification de la signature Webhook:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata;

      console.log('Données reçues du Webhook:', metadata);

      const googleAppsScriptUrl = `https://script.google.com/macros/s/${process.env.YOUR_SCRIPT_ID}/exec`;

      try {
        const response = await fetch(googleAppsScriptUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metadata),
        });

        const result = await response.json();
        console.log('Réponse du Google Apps Script:', result);
      } catch (err) {
        console.error('Erreur lors de l\'envoi des données vers Google Apps Script:', err);
      }
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}
