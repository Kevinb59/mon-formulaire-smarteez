const fetch = require('node-fetch');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Retourner immédiatement 200 à Stripe pour confirmer la réception
    res.status(200).send('Webhook reçu');

    // Exécuter le script Google Apps sans envoyer de données
    await fetch('https://script.google.com/macros/s/AKfycbwhcuqH8Gomtd56Jn5RkhM_9MqaVqamvHUd1yjgDvetXLTovHZpbPSWQNppNVbClVrfKg/exec', {
      method: 'GET', // Appel GET pour exécuter le script sans transmettre de données
    });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}
