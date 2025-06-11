const express = require('express');
const fs = require('fs');
const path = require('path');
const tasksData = require('./tasks.json');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/update', (req, res) => {
    const { date, statuses } = req.body;
    if (!date || !Array.isArray(statuses)) {
        return res.status(400).json({ success: false, message: 'Invalid data' });
    }

    const filePath = path.join(__dirname, 'daily_tasks.json');
    let data;
    try {
        data = JSON.parse(fs.readFileSync(filePath));
    } catch (err) {
        data = { jours: [] };
    }

    let jour = data.jours.find(j => j.date === date);
    if (!jour) {
        jour = { date, taches: tasksData.tasks.map(n => ({ nom: n, fait: false })) };
        data.jours.push(jour);
    }

    jour.taches.forEach((t, i) => {
        if (i < statuses.length) {
            t.fait = statuses[i];
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
