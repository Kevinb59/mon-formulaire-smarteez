import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const phonesFilePath = path.join(process.cwd(), 'phones.json');
      const newPhonesData = req.body; // Les nouvelles données envoyées depuis le formulaire admin

      // Écrire les nouvelles données dans le fichier phones.json
      await fs.writeFile(phonesFilePath, JSON.stringify(newPhonesData, null, 2));

      res.status(200).json({ message: 'Modifications sauvegardées avec succès.' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la sauvegarde.' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée.' });
  }
}
