const express = require('express');
const path = require('path');
const fs = require('fs');
const { Loki } = require('@lokidb/loki');

const app = express();
var db = new Loki('sandbox.db');
const dbProfiles = db.addCollection('profiles');
const dbMessages = db.addCollection('messages');

if (dbProfiles.count() === 0) {
  try {
    const data = fs.readFileSync('./public/profiles.json', 'utf8');
    const jsonData = JSON.parse(data);
    console.log(jsonData);
    dbProfiles.insert(jsonData);
  } catch (err) {
    console.error('Error reading or parsing the file:', err);
  }
}

if (dbMessages.count() === 0) {
  const profiles = dbProfiles.find();
  const senderProfile = profiles[0];

  profiles.forEach((profile) => {
    dbMessages.insert([
      {
        sender: profile.username,
        receiver: senderProfile.username,
        text: 'See you later',
        timestamp: '4/16/2024, 8:31:41 AM',
      },
      {
        sender: senderProfile.username,
        receiver: profile.username,
        text: 'See you later',
        timestamp: '4/16/2024, 8:31:41 AM',
      },
    ]);
  });
}

const staticDir = path.join(__dirname, '/public');

app.use(express.static(staticDir));

app.get('/api/profiles', async (req, res) => {
  const profiles = dbProfiles.find();
  res.send(profiles);
});

app.get('/api/messages/:username', async (req, res) => {
  const loginUser = dbProfiles.findOne({ username: 'saiembae' });
  const username = req.params.username;
  const messages = dbMessages.find({
    $or: [
      { sender: username, receiver: loginUser.username },
      { sender: loginUser.username, receiver: username },
    ],
  });

  console.log(messages);
  res.json(messages);
});

app.post('/api/messages/:username', async (req, res) => {
  const loginUser = dbProfiles.findOne({ username: 'saiembae' });
  const username = req.params.username;
  const messages = dbMessages.find({
    $or: [
      { sender: username, receiver: loginUser.username },
      { sender: loginUser.username, receiver: username },
    ],
  });

  res.send(messages);
});

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
