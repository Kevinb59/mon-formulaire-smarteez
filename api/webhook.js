const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Recevoir les données Stripe
    const stripeEvent = req.body;

    // Retourner immédiatement 200 à Stripe pour confirmer la réception
    res.status(200).send('Webhook reçu');

    // Configurer le transporteur d'emails Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Créer l'email à envoyer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'sasmarteez@gmail.com',
      subject: 'Nouvelle commande reçue',
      text: 'Une nouvelle commande a été passée via Stripe.'
    };

    // Envoyer l'email avec Nodemailer
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
      } else {
        console.log('Email envoyé avec succès:', info.response);
      }
    });
    
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}
