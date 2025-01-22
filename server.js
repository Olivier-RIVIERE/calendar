const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Route pour récupérer tous les événements
app.get('/events', (req, res) => {
  fs.readFile('events.json', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read events file' });
    }
    const events = JSON.parse(data || '[]');
    res.json(events);
  });
});

// Route pour enregistrer un événement
app.post('/addEvent', (req, res) => {
  const newEvent = req.body;

  // Lire le fichier events.json
  fs.readFile('events.json', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read events file' });
    }

    const events = JSON.parse(data || '[]');

    // Ajouter le nouvel événement
    events.push(newEvent);

    // Sauvegarder les événements mis à jour
    fs.writeFile('events.json', JSON.stringify(events, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save event' });
      }
      res.status(200).json({ message: 'Event saved successfully' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
