const sgMail = require('@sendgrid/mail');

// Configuration de l'API SendGrid avec ta clé
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Recevoir les données Stripe (si nécessaire)
    const stripeEvent = req.body;

    // Retourner immédiatement 200 à Stripe pour confirmer la réception
    res.status(200).send('Webhook reçu');

    // Créer l'email
    const msg = {
      to: 'sasmarteez@gmail.com',  // L'adresse de destination
      from: 'sasmarteez@gmail.com', // L'adresse de l'expéditeur (vérifiée avec SendGrid)
      subject: 'Test d\'envoi d\'email avec SendGrid',
      text: 'Ceci est un test d\'envoi d\'email avec SendGrid depuis Vercel.',
    };

    try {
      // Envoyer l'email via SendGrid
      await sgMail.send(msg);
      console.log('Email envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      if (error.response) {
        console.error('Détails de l\'erreur:', error.response.body);
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}
