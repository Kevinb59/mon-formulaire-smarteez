const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

export default async function handler(req, res) {
  // Activer CORS pour permettre les requêtes cross-origin
  const corsHandler = cors({
    origin: ['https://smart-z.vercel.app', 'https://www.smart-z.fr'], // Ajoute les deux domaines ici
    methods: ['POST'],
    allowedHeaders: ['Content-Type'],
  });

  return corsHandler(req, res, async () => {
    if (req.method === 'POST') {
      const {
        firstName, lastName, email, phone,
        address, address2, city, postalCode,
        phoneBrand, phoneModel, customText, imageUrl, quantity
      } = req.body;

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'eur',
                product_data: {
                  name: `Coque personnalisée - ${phoneBrand} ${phoneModel}`,
                  images: [imageUrl], // URL de l'image fournie
                },
                unit_amount: 0, // Remplace par le prix unitaire réel en centimes d'euros (ex: 24,90 € => 2490)
              },
              quantity: quantity, // Quantité d'articles choisie dans le formulaire
            },
          ],
          mode: 'payment',
          success_url: 'https://smart-z.fr/success',
          cancel_url: 'https://smart-z.fr/cancel',
          metadata: {
            firstName,
            lastName,
            email,
            phone,
            address,
            address2,
            city,
            postalCode,
            phoneBrand,
            phoneModel,
            customText,
            imageUrl,
            quantity,
          },
        });

        res.status(200).json({ id: session.id });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    } else {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }
  });
}
