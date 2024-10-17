const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Autorise temporairement la méthode GET pour tester l'API
  if (req.method === 'GET') {
    // Réponse simple pour vérifier que l'API fonctionne
    res.status(200).json({ message: 'API fonctionne avec GET' });
  } else {
    // Retourne une erreur pour toute autre méthode (y compris POST pour l'instant)
    res.setHeader('Allow', 'GET');
    res.status(405).end('Méthode non autorisée');
  }
}
