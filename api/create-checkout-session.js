const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Vérifie si Stripe est bien configuré
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('Clé Stripe non configurée');
      }

      // Log pour vérifier que la clé Stripe est bien détectée
      console.log('Clé Stripe détectée : ', process.env.STRIPE_SECRET_KEY);

      // Réponse pour tester la route GET
      res.status(200).json({ message: 'API fonctionne avec GET' });
    } catch (err) {
      // Log de l'erreur rencontrée
      console.error('Erreur lors de la création de la session Stripe:', err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Méthode non autorisée');
  }
}
