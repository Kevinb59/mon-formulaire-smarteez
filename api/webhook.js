const sgMail = require('@sendgrid/mail');

// Assurez-vous que la clé API SendGrid est correctement configurée dans vos variables d'environnement
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Confirmation immédiate à Stripe
    res.status(200).send('Webhook reçu');

    // Configuration de l'email
    const msg = {
      to: 'sasmarteez@gmail.com', // Adresse de réception
      from: 'sasmarteez@gmail.com', // Adresse vérifiée SendGrid
      subject: 'Test d\'envoi de mail avec SendGrid',
      text: 'Ceci est un test d\'envoi de mail avec SendGrid depuis Vercel.',
    };

    // Envoi de l'email
    try {
      await sgMail.send(msg);
      console.log('Email envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error.response.body);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}
