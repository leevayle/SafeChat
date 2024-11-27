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

// Map to store connected clients with their phone number as key
const connectedClients = new Map();




wss.on('connection', (ws) => {
    // console.log('client connected');
  // Handle incoming message
  ws.on('message', (message) => {

    function SaveUser(){
        const messageData = JSON.parse(message.toString('utf-8'));
        const id = messageData.id;
        
            connectedClients.set(id, { ws, id });
    
            console.log('');
            console.log('New Client:', id + ' Logged on');
            console.log('->->->->->->->->->->');
            console.log('');
    }
    function routeMessage(messageData) {
        try {
            const recipientId = messageData.to; // Decoding 'to'
            const recipientClient = connectedClients.get(recipientId);
    
            if (recipientClient) {
                console.log(`Sending to: ${recipientId}`);
                recipientClient.ws.send(
                    JSON.stringify({
                        from: messageData.from,
                        message: Buffer.from(messageData.message, 'base64').toString('utf-8'),
                        timestamp: messageData.timestamp,
                    })
                );
            } else {
                console.log(`${recipientId} is offline.`);
            }
        } catch (err) {
            console.error('Error in routing message:', err);
        }
    }
    
    ws.on('message', (message) => {
        try {
            if (!message) {
                console.error('Received an empty message.');
                return;
            }
    
            const messageData = JSON.parse(message.toString('utf-8'));
            const decodedMessage = Buffer.from(messageData.message, 'base64').toString('utf-8');
    
            if (decodedMessage === '@SafeChat_connect_user') {
                SaveUser();
            } else {
                const decodedUsername = Buffer.from(messageData.u_n, 'base64').toString('utf-8');
                console.log('');
                console.log('_________________________');
                console.log('~ ' + decodedUsername);
                console.log('-------------------------');
                console.log('Text:', decodedMessage);
                console.log('To:', messageData.to); // Verify the 'to' field is present
                console.log('***************************');
    
                // Pass `messageData` to `routeMessage`
                routeMessage(messageData);
            }
        } catch (err) {
            console.error('Error processing message:', err);
        }
    });
    
    

    try {
        if (!message) {
            console.error('Received an empty message.');
            return;
        }
    
        const messageData = JSON.parse(message.toString('utf-8'));
        // console.log('Received Message Data:', messageData);
    
        const decodedMessage = Buffer.from(messageData.message, 'base64').toString('utf-8');
        // console.log('Decoded Message:', decodedMessage);
        
    
        
        if (decodedMessage === '@SafeChat_connect_user') {
            SaveUser();
        } else {
            const decodedUsername = Buffer.from(messageData.u_n, 'base64').toString('utf-8');
            console.log('');
            console.log('_________________________');
            console.log('~ ' + decodedUsername);
            console.log('-------------------------');
            console.log('Text:', decodedMessage);
            // console.log('Time:', messageData.timestamp);
            console.log('To:'+messageData.to);
            console.log('***************************');

            routeMessage();
        }
    } catch (err) {
        console.error('Error processing message:', err);
    }
    
  });

  // Handle client disconnect
  ws.on('close', () => {

    const disconnectedPhone = [...connectedClients.keys()].find((phone) => connectedClients.get(phone).ws === ws);
    if (disconnectedPhone) {

      connectedClients.delete(disconnectedPhone);

      console.log('');
      console.log('Client:', disconnectedPhone + ' logged Off');
      console.log('-<-<-<-<-<-<-<-<-<');
      console.log('');
    }
  });

  // Handle WebSocket errors
  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
    const erroredPhone = [...connectedClients.keys()].find((phone) => connectedClients.get(phone).ws === ws);
    if (erroredPhone) {

      connectedClients.delete(erroredPhone);

    }
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