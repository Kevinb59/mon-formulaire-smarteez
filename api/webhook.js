const fetch = require('node-fetch');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Recevoir les données Stripe
    const stripeEvent = req.body;

    // Retourner immédiatement 200 à Stripe pour confirmer la réception
    res.status(200).send('Webhook reçu');

    // Envoyer les données à Google Apps Script (facultatif si tu veux envoyer des métadonnées)
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbyTYEks3Ijs12y7uCdPzy7UBJK7ygehesvQI7FvOLHd0k_xwunzwpjGpR_DaNWDQxFACw/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stripeEvent),
      });

      if (!response.ok) {
        console.error('Erreur lors de l’envoi à Google Apps Script:', response.statusText);
      } else {
        console.log('Données transmises à Google Apps Script avec succès.');
      }
    } catch (error) {
      console.error('Erreur lors de la requête vers Google Apps Script:', error);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}
