// Flag to ensure WebSocket connection happens only once
let isConnected = false;
let ws; // Declare WebSocket variable
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

// Function to connect to WebSocket server
function connectWebSocket() {
    if (isConnected) return; // Don't connect if already connected

    ws = new WebSocket(`ws://${window.location.hostname}:3000`); // Replace with dynamic WebSocket URL

    // Handle WebSocket connection open event
    ws.onopen = () => {

        const id = localStorage.getItem('id_phn') || btoa('unknown');
        const un = localStorage.getItem('u_n') || btoa('guest user'); 

        isConnected = true;
        reconnectAttempts = 0; // Reset reconnect attempts on successful connection
        console.log("Connected to SafeChat server");

        ws.send(JSON.stringify({"id":id, "message": btoa("@SafeChat_connect_user"),"username":un}));
    };

    // Handle WebSocket messages from the server
    ws.onmessage = (message) => {
        const parentDiv = document.querySelector('.full-text'); // Parent div for appending
    
        try {
            if (message) {
                const messageData = JSON.parse(message.data); // Parse the message data
    
                // Format the current time without seconds/milliseconds
                const currentTime = new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                });
    
                // Define the entire div structure as a template string
                const messageHtml = `
                    <div class="text-ab">
                        <div class="texts aa">
                            <div id="text-aa" class="text-message">
                                ${messageData.message}
                            </div>
                        </div>
                        <div class="text-reports">
                            <div class="read-reports sent received">
                                √√
                            </div>
                            <div class="text-time sent">
                                ${currentTime}
                            </div>
                        </div>
                    </div>
                    <div class="full-text"></div>
                `;
    
                // Create a temporary container to convert the HTML string to DOM elements
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = messageHtml;
    
                // Append the new message to the end of the parent div
                parentDiv.appendChild(tempDiv.firstElementChild);
    
                console.log('Message received:', messageData.message);
            }
        } catch (err) {
            console.error('Error handling message:', err);
        }
    };
    

    // Handle WebSocket connection error
    ws.onerror = (error) => {
        console.error("WebSocket error: ", error);
        isConnected = false; // Reset connection status in case of error
    };

    // Handle WebSocket connection close event
    ws.onclose = () => {
        console.log("SafeChat server Offline. Retrying to connect");
        isConnected = false; // Reset connection status when closed

        // Retry connection if not reached max attempts
        if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            setTimeout(connectWebSocket, 3000); // Retry connection in 3 seconds
        } else {
            console.log("Max reconnect attempts reached. Seems the server is offline :(");
        }
    };
}

// Call the function to connect once on page load
connectWebSocket();

// Ensure WebSocket is closed when the page is unloaded
window.addEventListener('beforeunload', () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
    }
});

// Send message to WebSocket server when button is clicked
document.getElementById('send').addEventListener('click', () => {
    const message = document.getElementById('msg').value;

    // check connection
    if (!isConnected) {
        alert("Not connected to the server yet!");
        return;
    }

    // Get data from localStorage
    const idPhn = localStorage.getItem('id_phn') || 'unknown';
    const uN = localStorage.getItem('u_n') || '';
    const timestamp = new Date().toISOString(); // Get the current timestamp in ISO format

    if (message) {
        
        const messageData = {
            to: btoa('+254748673538'),
            from: idPhn,  
            u_n: uN,      
            timestamp: timestamp,  
            message: btoa(message), 
        };

        
        ws.send(JSON.stringify(messageData));
        console.log("You: " + message);

        
        document.getElementById('msg').value = '';
    } else {

        // i prefer no to do anything, i handle that with a different script
    }
});
