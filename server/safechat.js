const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
const favicon = require('serve-favicon');
const handleFileUpload = require('./upload');
const setupRegistrationApi = require('./signup'); // Import the registration API setup

const app = express();

app.use(favicon(path.join(__dirname, '../images/icon.png')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on('connection', (ws) => {
    console.log('New Client connected');
    clients.add(ws);
    ws.send('Welcome');
  
    ws.on('message', (message) => {
      try {
        // Parse the message (assuming it's JSON format)
        const messageData = JSON.parse(message.toString('utf-8'));
  
        // Decode the 'message' and 'username' fields from Base64
        const decodedMessage = Buffer.from(messageData.message, 'base64').toString('utf-8');
        const decodedUsername = Buffer.from(messageData.u_n, 'base64').toString('utf-8');
  
        console.log('-----------------------');
        console.log('New SafeChat Client Log:');
        console.log('-----------------------');
        console.log('Username:', decodedUsername);
        console.log('Message:', decodedMessage);
        console.log('To:'+ messageData.to);
        console.log('T:'+ messageData.timestamp);
        console.log('----------------------');
      } catch (err) {
        console.error('Error processing message:', err);
      }
    });
  
    ws.on('close', () => {
      console.log('Client disconnected');
      clients.delete(ws);
    });
  
    ws.on('error', (err) => {
      console.error('WebSocket error:', err);
      clients.delete(ws);
    });
  });
  

app.use(express.static(path.join(__dirname, '../')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup the registration API
setupRegistrationApi(app);

handleFileUpload(app);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
