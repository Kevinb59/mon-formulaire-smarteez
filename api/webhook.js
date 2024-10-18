const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      const rawBody = await buffer(req);  // On obtient le corps brut de la requête
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      console.error('Erreur lors de la vérification de la signature Webhook:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Traitement de l'événement 'checkout.session.completed'
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata;

      console.log('Données du Webhook:', metadata);

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
        console.error('Erreur lors de l\'envoi des données vers Google Apps Script:', err.message);
      }
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}

export const config = {
  api: {
    bodyParser: false,  // Désactiver le bodyParser pour lire les requêtes brutes (raw body)
  },
};

// Fonction pour lire le corps brut de la requête
function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    req.on('error', reject);
  });
}
