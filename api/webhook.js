const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Recevoir les données Stripe (pour plus tard)
    const stripeEvent = req.body;

    // Retourner immédiatement 200 à Stripe pour confirmer la réception
    res.status(200).send('Webhook reçu');

    // Configurer Nodemailer pour envoyer des mails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Ton adresse Gmail
        pass: process.env.EMAIL_PASS, // Le mot de passe d'application généré
      },
    });

    // Options de l'email
    const mailOptions = {
      from: process.env.EMAIL_USER, // L'adresse de l'expéditeur
      to: 'sasmarteez@gmail.com', // L'adresse de réception (là où tu veux envoyer l'email)
      subject: "Test d'envoi de mail avec Nodemailer",
      text: "Ceci est un test d'envoi de mail avec Nodemailer depuis Vercel.", // Contenu du mail
    };

    // Envoyer l'email
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email envoyé avec succès');
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Méthode non autorisée');
  }
}
