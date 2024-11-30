const fs = require('fs');
const path = require('path');

async function saveMessage(userId, messageData, ws) {
    const currentDate = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const messagesDir = path.join(__dirname, "..", 'messages');  // Ensure the messages directory exists
    const messageFilePath = path.join(messagesDir, `${currentDate} _messages.json`);

    try {
        // Ensure the directory exists
        if (!fs.existsSync(messagesDir)) {
            fs.mkdirSync(messagesDir, { recursive: true });
            // console.log(`Directory created: ${messagesDir}`);
        }

        let allMessages = {};

        // Read existing data if file exists
        if (fs.existsSync(messageFilePath)) {
            const fileData = await fs.promises.readFile(messageFilePath, 'utf-8');
            allMessages = JSON.parse(fileData);
        }

        // Ensure the date structure exists
        if (!allMessages[currentDate]) {
            allMessages[currentDate] = {};
        }

        // Ensure the user structure exists within the current date
        if (!allMessages[currentDate][userId]) {
            allMessages[currentDate][userId] = {};
        }

        // Log the messageData to inspect it
        // console.log("Message data:", messageData);

        // Destructure messageData to get necessary fields
        const { messageid, to, from, message, timestamp, u_n, path, status, statustime } = messageData;

        // // Debug: Ensure `from` is present
        // console.log("From ID:", from);

        // Check if `from` is missing or undefined
        if (!from) {
            console.error("Error: 'from' field is missing or undefined in messageData");
            return;
        }

        // Check if `messageid` is missing or undefined
        if (!messageid) {
            console.error("Error: 'messageid' is missing in messageData");
            return;
        }

        // Save the message under its messageid
        allMessages[currentDate][userId][messageid] = {
            to,
            from,  
            message,
            timestamp,
            u_n,
            path,
            status,
            statustime
        };

        // Write updated messages back to the file (merging, not overwriting)
        await fs.promises.writeFile(messageFilePath, JSON.stringify(allMessages, null, 2));

        // console.log('Message saved successfully!');

        // Send success message to the client
        if (ws) {
            ws.send(JSON.stringify({ status: 'success', message: 'Message saved successfully!' }));
        }
    } catch (error) {
        console.error('Error saving message:', error);

        // Send failure message to the client
        if (ws) {
            ws.send(JSON.stringify({ status: 'failure', message: 'Failed to save message.' }));
        }
    }
}

module.exports = { saveMessage };
