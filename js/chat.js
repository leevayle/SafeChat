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
        const parentDiv = document.querySelector('.message-cont'); // Target the container
        try {
            if (message) {
                const messageData = JSON.parse(message.data);
                // console.log(messageData.statustime);
    
                // Get the 'from' field from the received message and local storage 'idPhn'
                const fromId = messageData.from;
                const localIdPhn = localStorage.getItem('id_phn');
    
                // If the message is from the current user, do not append it
                if (fromId === localIdPhn) {
                    // console.log("Skipped appending own message.");
                    return;
                }
    
                const decodedMessage = messageData.message;
                const timestamp = new Date(messageData.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                });
                // console.log(messageData.profilepath)
                

                //Create HTML for client chats
                const messagechatparentDIV = document.querySelector('.history');
                const messagechathtml = `
                <div id="${messageData.from}" class="text">
                    <div class="t-profile ">
                        <div class="person">
                            <img id="user-profile-url" src="${messageData.profilepath}">
                            
                        </div>
                        <div id="online-status" class="offline-status">

                        </div>
                    </div>
                    <div class="t-text ">
                        <div id="user-name" class="t-name ">
                            ${atob(messageData.from)}
                        </div>
                        <div id="user-message" class="t-message " title="${messageData.message}">
                            ${messageData.message}
                        </div>
                    </div>
                    <div class="t-time ">
                        <div id="user-message-time" class="t-time1 ">
                            ${messageData.statustime}
                        </div>
                        <div id="user-message-count" class="t-notification t-active">
                            1
                        </div>
                    </div>
                </div>
                
                `
    
                // Create the HTML for client inbox
                const receivedMessageHtml = `
                    <div class="text-ab">
                        <div class="texts aa">
                            <div id="text-aa" class="text-message">
                                ${decodedMessage}
                            </div>
                        </div>
                        <div class="text-reports">
                            <div class="read-reports sent received">
                                <!-- √√ --> 
                            </div>
                            <div class="text-time sent">
                                ${timestamp}
                            </div>
                        </div>
                    </div>
                `;
    
                const fullTextHtml = `<div class="full-text"></div>`;
    
                // Create temporary divs for appending
                const receivedMessageDiv = document.createElement('div');
                receivedMessageDiv.innerHTML = receivedMessageHtml;
    
                const fullTextDiv = document.createElement('div');
                fullTextDiv.innerHTML = fullTextHtml;

                // const messagechatDIV = document.createElement('div');
                // messagechatDIV.innerHTML = messagechathtml;

                // now i want to append only if the div doesn't already exist, if it does, just update the text
                // Check if an element with the same ID already exists
            const existingChatDiv = document.getElementById(messageData.from);

            if (existingChatDiv) {
                // Update the existing chat div
                const messageTextDiv = existingChatDiv.querySelector('#user-message');
                const messageTimeDiv = existingChatDiv.querySelector('#user-message-time');
                const messageCountDiv = existingChatDiv.querySelector('#user-message-count');
                const profileImage = existingChatDiv.querySelector('#user-profile-url');

                if (messageTextDiv) messageTextDiv.textContent = messageData.message;
                if (messageTimeDiv) messageTimeDiv.textContent = messageData.statustime;

                // Update message count
                if (messageCountDiv) {
                    let currentCount = parseInt(messageCountDiv.textContent, 10);
                    messageCountDiv.textContent = isNaN(currentCount) ? 1 : currentCount + 1;
                }
                            // Update profile image if it has changed
                if (profileImage && profileImage.src !== messageData.profilepath) {
                    profileImage.src = messageData.profilepath;
                }

                // Update counter div to active
                const messageCount = document.getElementById('user-message-count');
                if (messageCount) {
                    messageCount.classList.add('t-active');
                }
            } else {
                // Create a new chat div and append it if it doesn't exist
                const messagechatDIV = document.createElement('div');
                messagechatDIV.innerHTML = messagechathtml;
                messagechatparentDIV.appendChild(messagechatDIV.firstElementChild);
            }

    
                // Append the received message only if it's not from the current user
                // messagechatparentDIV.appendChild(messagechatDIV.firstElementChild);
                parentDiv.appendChild(receivedMessageDiv.firstElementChild);
                parentDiv.appendChild(fullTextDiv.firstElementChild);
            }
        } catch (err) {
            console.error('Error processing received message:', err);
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

// Send message to server
document.getElementById('send').addEventListener('click', () => {
    const message = document.getElementById('msg').value;

    // Check connection
    if (!isConnected) {
        alert("You're not connected to the SafeChat server!");
        return;
    }

    // Get info
    const idPhn = localStorage.getItem('id_phn') || 'unknown';
    const profilepath = (`../images/profiles/${idPhn}.jpg`);
    const uN = localStorage.getItem('u_n') || '';
    const timestamp = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    // change to-number when user clicks the chat
    let tophones = atob(localStorage.getItem('to'));
    // console.log(tophones);
    const from = atob(localStorage.getItem('id_phn'));

    // if(from) {
    //     if(from === "+254748673538") {
    //         tophones = "+254706463189";
    //         console.log('changed to 06');
    //     } else if(from === "+254706463189") {
    //         tophones = "+254748673538";
    //         console.log('changed to 48');
    //     }else{
    //         tophones = '+254700000000';
    //     }
    // }






    if (message) {
        const messageData = {
            messageid: idPhn + new Date().toISOString(),
            to: btoa(tophones),
            from: idPhn,
            u_n: uN,
            timestamp: new Date().toISOString(),
            message: btoa(message),
            path: profilepath,
            status: '1',
            statustime: timestamp
        };





        // Send action
        ws.send(JSON.stringify(messageData));

        // Append the sent message to the DOM
        const parentDiv = document.querySelector('.message-cont'); // parent for the message

        // Sent message HTML
        const sentMessageHtml = `
            <div class="text-ab" style="margin-left: auto;">
                <div class="texts bb">
                    <div id="text-bb" class="text-message">
                        ${message}
                    </div>
                </div>
                <div class="text-reports" style="margin-left: auto;">
                    <div class="read-reports sent">
                        √√
                    </div>
                    <div class="text-time sent">
                        ${timestamp}
                    </div>
                </div>
            </div>
        `;

        const fullTextHtml = `<div class="full-text"></div>`;

        // Create temporary divs for the message
        const sentMessageDiv = document.createElement('div');
        sentMessageDiv.innerHTML = sentMessageHtml;

        const fullTextDiv = document.createElement('div');
        fullTextDiv.innerHTML = fullTextHtml;

        

        // Append the sent message and full-text divs
        parentDiv.appendChild(sentMessageDiv.firstElementChild);
        parentDiv.appendChild(fullTextDiv.firstElementChild);

        // Check if a div for the recipient already exists
        const existingChatDiv = document.getElementById(messageData.to);
        
        if (existingChatDiv) {
            // Update the existing div for the recipient
            const messageTextDiv = existingChatDiv.querySelector('#user-message');
            const messageTimeDiv = existingChatDiv.querySelector('#user-message-time');
            const messageCountDiv = existingChatDiv.querySelector('#user-message-count');
            // const profileImage = existingChatDiv.querySelector('#user-profile-url');

            if (messageTextDiv) messageTextDiv.textContent = atob(messageData.message);
            if (messageTimeDiv) messageTimeDiv.textContent = messageData.statustime;

            // // Update message count
            // if (messageCountDiv) {
            //     let currentCount = parseInt(messageCountDiv.textContent, 10);
            //     messageCountDiv.textContent = isNaN(currentCount) ? 1 : currentCount + 1;
            // }

            // Update profile image if it has changed
            // if (profileImage && profileImage.src !== messageData.profilepath) {
            //     profileImage.src = messageData.profilepath;
            // }

           
            // const messageCount = document.getElementById('user-message-count');
            // if (messageCount) {
            //     messageCount.classList.remove('t-active');
            //     messageCount.textContent = '';
            // }

        } else {
            // Create and append a new chat div for the recipient if it doesn't exist
            const messageChatParentDiv = document.querySelector('.history');
            const messageChatHtml = `
                <div id="${messageData.to}" class="text">
                    <div class="t-profile ">
                        <div class="person">
                            <img id="user-profile-url" src="${messageData.profilepath}">
                        </div>
                        <div id="online-status" class="offline-status"></div>
                    </div>
                    <div class="t-text ">
                        <div id="user-name" class="t-name ">
                            ${atob(messageData.to)}
                        </div>
                        <div id="user-message" class="t-message " title="${atob(messageData.message)}">
                            ${atob(messageData.message)}
                        </div>
                    </div>
                    <div class="t-time ">
                        <div id="user-message-time" class="t-time1 ">
                            ${messageData.statustime}
                        </div>
                        <div id="user-message-count" class="t-notification ">
                            
                        </div>
                    </div>
                </div>
            `;

            const messageChatDiv = document.createElement('div');
            messageChatDiv.innerHTML = messageChatHtml;
            
            messageChatParentDiv.appendChild(messageChatDiv.firstElementChild);
            
        }

        // Clear the input field after sending
        document.getElementById('msg').value = '';
        document.getElementById('msg').focus();
    }
    document.getElementById('msg').value = '';
    document.getElementById('msg').focus();
});








document.addEventListener('DOMContentLoaded', () => {
    const parentContainer = document.querySelector('.history'); // Adjust as needed

    parentContainer.addEventListener('click', (event) => {
        const clickedElement = event.target.closest('.text'); // Check if click is within a `.text` element

        if (clickedElement) {
            const activeNotification = clickedElement.querySelector('.t-notification');
            if (activeNotification) {
                activeNotification.classList.remove('t-active');
                activeNotification.innerText = ''; // Clear any notification text if needed
            }
        }
    });
});





