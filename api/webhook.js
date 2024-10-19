const sgMail = require('@sendgrid/mail');

// Assurez-vous d'avoir configuré votre clé API SendGrid dans les variables d'environnement
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Recevoir les données Stripe (si nécessaire plus tard)
    const stripeEvent = req.body;

    // Retourner immédiatement 200 à Stripe pour confirmer la réception
    res.status(200).send('Webhook reçu');

    // Créer l'email à envoyer
    const msg = {
      to: 'sasmarteez@gmail.com', // Destinataire
      from: 'sasmarteez@gmail.com', // L'adresse vérifiée que tu as définie
      subject: 'Test d\'envoi de mail avec SendGrid',
      text: 'Ceci est un test d\'envoi de mail avec SendGrid depuis Vercel.',
    };

    // Envoyer l'email
    try {
      await sgMail.send(msg);
      console.log('Email envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}
