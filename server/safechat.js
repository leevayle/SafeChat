const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
const favicon = require('serve-favicon');
const handleFileUpload = require('./scripts/upload');
const setupRegistrationApi = require('./scripts/signup');
const { saveMessage } = require('./scripts/messageService');

const app = express();

app.use(favicon(path.join(__dirname, '../images/icon.png')));


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Map to store connected clients with their phone number as key
const connectedClients = new Map();

// saving a message



wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        function SaveUser() {
            const messageData = JSON.parse(message.toString('utf-8'));
            const id = messageData.id;
            const u = atob(messageData.username);
            

            connectedClients.set(id, { ws, u });
            console.log('');
            console.log(
                '\x1b[32m%s\x1b[0m \x1b[34m%s\x1b[0m',
                '■■■■■■■■►',  // Green
                "~ " +u                // Blue (username stored in variable `u`)
              );
              
        }
        async function SaveMessage(messageData) {
            const id = messageData.from;
            const messagePayload = {
                messageid: messageData.messageid,
                to: messageData.to,
                from: messageData.from,
                message: Buffer.from(messageData.message, 'base64').toString('utf-8'),
                timestamp: messageData.timestamp,
                status: messageData.status,
                statustime: messageData.statustime
            };
            // console.log(messageData.id);
        
            try {
                await saveMessage(id, messagePayload); // Ensure saving is complete
                // console.log(
                //     '\x1b[36m%s\x1b[0m \x1b[35m%s\x1b[0m',
                //     '■■■ Saved: ',
                //     `From: ${messagePayload.from} | To: ${messagePayload.to}`
                // );
            } catch (err) {
                console.error('Error saving message:', err);
            }
        }
        
        

        async function routeMessage(messageData) {
            try {
                const recipientId = messageData.to;
                const recipientClient = connectedClients.get(recipientId);
        
                // Save the message regardless of recipient status
                await SaveMessage(messageData);
        
                if (recipientClient) {
                    console.log(`${messageData.messageid} √`);
                    recipientClient.ws.send(
                        JSON.stringify({
                            from: messageData.from,
                            message: Buffer.from(messageData.message, 'base64').toString('utf-8'),
                            timestamp: messageData.timestamp,
                            u_n: messageData.u_n,
                            messageid: messageData.messageid,
                            profilepath: messageData.path,
                            statustime:messageData.statustime,
                            to: messageData.to
                        })
                    );
                } else {
                    console.log(`${recipientId} is offline.`);
                }
            } catch (err) {
                console.error('Error in routing message:', err);
            }
        }
        

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
                console.log('■■■■ ' +"~ "+ decodedUsername);                
                console.log( decodedMessage);
                console.log(`ID : ` + messageData.messageid);

                // Correctly call `routeMessage` with `messageData`
                routeMessage(messageData);
            }
        } catch (err) {
            console.error('Error processing message:', err);
        }
    });

    // Handle client disconnect
    ws.on('close', () => {
        const disconnectedClient = [...connectedClients.values()].find(
            (client) => client.ws === ws
        );
    
        if (disconnectedClient) {
            const { u } = disconnectedClient;
            connectedClients.delete(disconnectedClient.id); // Remove using the ID
    
            console.log('');
            console.log(
                '\x1b[31m%s\x1b[0m \x1b[34m%s\x1b[0m \x1b[31m%s\x1b[0m',
                '◄■■■■■■■■',  // Red
                "~ "+u,        // Blue (username stored in variable `u`)
                '' // Red
              );
              
            
        }
    });
    

    // Handle WebSocket errors
    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
        const erroredPhone = [...connectedClients.keys()].find(
            (phone) => connectedClients.get(phone).ws === ws
        );
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