const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const jwt = require('jsonwebtoken');
const { Loki } = require('@lokidb/loki');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const jwtSecret = 'abc123';
var db = new Loki('database.db');
const dbProfiles = db.addCollection('profiles');
const dbMessages = db.addCollection('messages');

if (dbProfiles.count() === 0) {
  try {
    const data = fs.readFileSync('./public/profiles.json', 'utf8');
    const jsonData = JSON.parse(data);
    dbProfiles.insert(jsonData);
  } catch (err) {
    console.error('Error reading or parsing the file:', err);
  }
}

const staticDir = path.join(__dirname, '/public');

app.use(express.static(staticDir));

function verifyToken(req) {
  try {
    const token = req.cookies['token'];
    if (!token) {
      return null;
    }

    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
}

app.get('/api/profiles', async (req, res) => {
  const user = verifyToken(req);
  if (!user) {
    res.redirect(301, 'http://localhost:3000/signin');
    return;
  }

  const profiles = dbProfiles.find({ username: { $not: { $eq: user.username } } });
  res.send(profiles);
});

app.get('/api/messages/:username', async (req, res) => {
  const user = verifyToken(req);
  if (!user) {
    res.redirect(301, 'http://localhost:3000/signin');
    return;
  }

  const username = req.params.username;
  const messages = dbMessages.find({
    $or: [
      { sender: username, receiver: user.username },
      { sender: user.username, receiver: username },
    ],
  });

  res.json(messages);
});

app.post('/api/messages/:username', async (req, res) => {
  console.log('POST /api/messages/:username');

  const loginUser = verifyToken(req);
  if (!loginUser) {
    res.redirect(301, 'http://localhost:3000/signin');
  }
  const username = req.params.username;
  const message = {
    sender: loginUser.username,
    receiver: username,
    text: req.body.text,
    timestamp: new Date().toLocaleString(),
  };

  const msg = dbMessages.insert(message);
  if (msg) {
    res.status(200).json(msg);
  }

  res.status(500).send();
});

app.post('/api/signin', async (req, res) => {
  const user = dbProfiles.findOne({ username: req.body.enrollment, password: req.body.password });
  if (!user) {
    res.status(404).json();
  }
  const token = jwt.sign(user, jwtSecret);
  res.cookie('token', token, { maxAge: 900000, httpOnly: true, domain: 'localhost' });
  res.status(200).json(user);
});

app.get('/', async (req, res) => {
  const user = verifyToken(req);
  if (!user) {
    res.cookie('token', '', { maxAge: 0 });
    res.redirect(301, 'http://localhost:3000/signin');
  }

  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/signin', async (req, res) => {
  const user = verifyToken(req);
  if (user) {
    res.redirect(301, 'http://localhost:3000/');
  }

  res.sendFile(path.join(__dirname, 'signin.html'));
});

app.post('/api/signout', async (req, res) => {
  res.cookie('token', '', { maxAge: 0 });
  res.status(200).json();
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
