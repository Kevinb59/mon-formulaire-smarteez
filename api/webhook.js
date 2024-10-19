const sgMail = require('@sendgrid/mail');

// Configuration de la clé API de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('---- Requête reçue ----');
    console.log('Headers:', req.headers);
    console.log('Corps de la requête:', req.body);

    // Retourner immédiatement 200 à Stripe pour confirmer la réception
    res.status(200).send('Webhook reçu');

    // Préparation du corps de l'email
    const msg = {
      to: 'sasmarteez@gmail.com',  // Adresse de réception
      from: 'sasmarteez@gmail.com',  // Adresse vérifiée sur SendGrid
      subject: 'Test SendGrid avec logs détaillés',
      text: 'Ceci est un email de test envoyé avec SendGrid. Voici le contenu de la requête Stripe: ' + JSON.stringify(req.body),
      html: `<strong>Ceci est un test</strong><br/><br/>Contenu de la requête Stripe: <pre>${JSON.stringify(req.body)}</pre>`
    };

    // Tentative d'envoi de l'email via SendGrid
    try {
      console.log('Tentative d\'envoi de l\'email...');
      const response = await sgMail.send(msg);
      console.log('Réponse de SendGrid:', response);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email avec SendGrid:', error);

      // Log des détails d'erreur retournés par SendGrid
      if (error.response) {
        console.error('Réponse d\'erreur de SendGrid:', error.response.body);
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    console.log('Méthode non autorisée: Tentative avec une autre méthode que POST');
    res.status(405).end('Méthode non autorisée');
  }
}
